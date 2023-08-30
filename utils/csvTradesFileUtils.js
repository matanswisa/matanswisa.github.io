import Account from "../models/accounts.js";
import SelectedAccountModel from "../models/selectedAccount.js";
import Trade from "../models/trade.js";
import User from "../models/user.js";


const emptyFields = ['Pair ID', 'Buy Fill ID', 'Sell Fill ID', 'Paired Qty', 'Buy Price', 'Sell Price', 'P/L', 'Currency', 'Bought Timestamp', 'Sold Timestamp']

function removeObjectsWithEmptyFields(arrayOfObjects, emptyFields = ['Pair ID', 'Buy Fill ID', 'Sell Fill ID', 'Paired Qty', 'Buy Price', 'Sell Price', 'P/L', 'Currency', 'Bought Timestamp', 'Sold Timestamp']) {
    return arrayOfObjects.filter(item => {
        const hasEmptyField = emptyFields.some(field => !item[field]);
        return !hasEmptyField;
    });
}



function groupByPositionId(array) {
    const grouped = {};

    array.forEach(item => {
        const positionId = item['Position ID'];

        if (!grouped[positionId]) {
            grouped[positionId] = [];
        }

        grouped[positionId].push(item);
    });

    return grouped;
}

const handleMergeRows = (data) => {

    //Deleting any 'empty row' - objects which missing important values.
    const tradesCsvDataWithoutEmptyRows = removeObjectsWithEmptyFields(data)


    const groupedRows = tradesCsvDataWithoutEmptyRows.reduce((acc, row) => {
        const id = row['Position ID'];
        if (row['Buy Price'] === '' || row['Sell Price'] === '' || row['P/L'] === '') {
            return acc; // Skip rows with null values
        }

        if (!acc[id]) {
            acc[id] = {
                ...row,
                'P/L': parseFloat(row['P/L'] || 0),
                'time1': 0,
                'time2': 0
            };
        } else {
            acc[id]['P/L'] += parseFloat(row['P/L'] || 0);
            acc[id]['Sold Timestamp'] = row['Sold Timestamp'];
        }

        return acc;
    }, {});



    const positionsIdsObject = groupByPositionId(data)
    let firstBoughtTimestamp;
    let firstSoldTimestamp;
    const timesObject = {};
    for (let key in positionsIdsObject) {
        const dataOfPositions = positionsIdsObject[key];
        timesObject[key] = { time1: 0, time2: 0 };
        firstBoughtTimestamp = dataOfPositions[0]['Bought Timestamp'];
        firstSoldTimestamp = dataOfPositions[0]['Sold Timestamp'];
        timesObject[key]['time1'] = Math.abs(new Date(dataOfPositions[0]['Bought Timestamp']) - new Date(dataOfPositions[dataOfPositions.length - 1]['Sold Timestamp']));   //Time1= arr[0][buytime stamp] - arr[len-1][sold timestamp]
        timesObject[key]['time2'] = Math.abs(new Date(dataOfPositions[0]['Sold Timestamp']) - new Date(dataOfPositions[dataOfPositions.length - 1]['Bought Timestamp']));
    }

    for (const id in groupedRows) {
        if (groupedRows.hasOwnProperty(id)) {
            const times = timesObject[id]

            // groupedRows[id]['LongShort'] = times.time2 >= times.time1  && firstSoldTimestamp < firstBoughtTimestamp ? "Short" : "Long";
            groupedRows[id]['LongShort'] = (times.time2 >= times.time1 && firstSoldTimestamp < firstBoughtTimestamp) ? "Short" : ((times.time1 >= times.time2 && firstBoughtTimestamp < firstSoldTimestamp) ? "Short" : "Long");

        }
    }

    const mergedRows = Object.values(groupedRows);

    return mergedRows;
};

const calcCommission = (contractName) => {
    if (contractName.includes("Micro")) {
        return 1;
    }

    return 3;
}


function sumArrayOfLengthsAndTradeHistory(obj) {
    let totalLength = 0;

    for (const key in obj) {
        if (Array.isArray(obj[key])) {
            totalLength += obj[key].length;

            for (const item of obj[key]) {
                if (item.hasOwnProperty('tradeHistory') && Array.isArray(item.tradeHistory)) {
                    totalLength += item.tradeHistory.length;
                }
            }
        }
    }

    return totalLength;
}



export const buildTradesDataByTradovateCSV = async (csvData, userId, accountId) => {

    const mergedRows = handleMergeRows(csvData);

    let count = csvData.length; // Total number of trades
    let uploadedTradeCounter = 0;
    let tradesWithPartiels = [];
    let isAllUploaded = false;


    for (let i = 0; i < csvData.length; i++) {

        if (
            csvData[i]["Buy Price"] === "" ||
            csvData[i]["Sell Price"] === "" ||
            csvData[i]["P/L"] === "" ||
            csvData[i]["Bought Timestamp"] === "" ||
            csvData[i]["Sold Timestamp"] === ""
        ) {
            count -= 1;
            continue; // Skip rows with empty fields
        }
        let commissionSize = calcCommission(csvData[i]["Product Description"]) * -1;
        let totalCommissionInDollars = commissionSize * csvData[i]["Paired Qty"];

        const netROI = ((csvData[i]["Sell Price"] - csvData[i]["Buy Price"]) / csvData[i]["Buy Price"]) * 100;
        const data = {
            entryDate: csvData[i]["Bought Timestamp"] || "",
            symbol: csvData[i]["Product"] || "",
            status: csvData[i]["P/L"] < 0 ? "Loss" : csvData[i]["P/L"] > 0 ? "Win" : "Break Even",
            netROI: netROI.toFixed(2),
            stopPrice: 0,
            longShort: csvData[i]["Buy Price"] < csvData[i]["Sell Price"] ? "Long" : "Short" || "",
            contracts: csvData[i]["Paired Qty"] || "",
            entryPrice: csvData[i]["Buy Price"] || "",
            exitPrice: csvData[i]["Sell Price"] || "",
            duration: "",
            commission: totalCommissionInDollars,
            comments: "",
            netPnL: csvData[i]["P/L"] !== undefined ? csvData[i]["P/L"] : "",
            transactionId: csvData[i]["Position ID"],
        }




        const boughtTimestamp = new Date(csvData[i]["Bought Timestamp"]);
        const soldTimestamp = new Date(csvData[i]["Sold Timestamp"]);


        const timeDifferenceInMinutes = (soldTimestamp - boughtTimestamp) / (1000 * 60);
        const absoluteDurationInMinutes = Math.abs(timeDifferenceInMinutes)
        data.duration = absoluteDurationInMinutes || "";



        if (data.status == "Break Even") {

            const timeDifferenceInMinutes = (soldTimestamp - boughtTimestamp) / (1000 * 60);
            data.duration = timeDifferenceInMinutes || "";
            data.netROI = 0;
        }
        tradesWithPartiels.push(data);

    }

    if (!(count === tradesWithPartiels.length))
        throw Error("Couldn't build all trades of tradovate csv.");







    for (let i = 0; i < mergedRows.length; i++) {

        const trade = mergedRows[i];
        let commissionSize = calcCommission(trade["Product Description"]) * -1;
        let totalCommissionInDollars = commissionSize * trade["Bought"];




        //this code responsible to build a main trade partials we add after - 

        const netROI = ((trade["Sell Price"] - trade["Buy Price"]) / trade["Buy Price"]) * 100;
        const data = {
            entryDate: trade["Bought Timestamp"] || "",
            symbol: trade["Product"] || "",
            status: trade["P/L"] < 0 ? "Loss" : trade["P/L"] > 0 ? "Win" : "Break Even",
            netROI: netROI.toFixed(2),
            stopPrice: 0,
            // longShort: trade["Buy Price"] < trade["Sell Price"] ? "Long" : "Short" || "",
            longShort: mergedRows[i]['LongShort'],
            contracts: trade["Bought"] || "",
            entryPrice: trade["Buy Price"] || "",
            exitPrice: trade["Sell Price"] || "",
            duration: "",
            commission: totalCommissionInDollars,
            comments: "",
            netPnL: trade["P/L"] !== undefined ? trade["P/L"] + totalCommissionInDollars : "",
            transactionId: trade["Position ID"],
        }




        const boughtTimestamp = new Date(trade["Bought Timestamp"]);
        const soldTimestamp = new Date(trade["Sold Timestamp"]);


        const timeDifferenceInMinutes = (soldTimestamp - boughtTimestamp) / (1000 * 60);
        const absoluteDurationInMinutes = Math.abs(timeDifferenceInMinutes)
        data.duration = absoluteDurationInMinutes || "";



        if (data.status == "Break Even") {

            const timeDifferenceInMinutes = (soldTimestamp - boughtTimestamp) / (1000 * 60);
            data.duration = timeDifferenceInMinutes || "";
            data.netROI = 0;
        }


        //Code is repeat itself need to create functions for later use
        const account = await Account.findOne({ _id: accountId });
        const existingTrade = account.trades.find((trd) => trd.transactionId == data.transactionId);

        if (!existingTrade) {
            uploadedTradeCounter++;
            const newTrade = await Trade.create({
                entryDate: data.entryDate,
                symbol: data.symbol,
                status: data.status,
                netROI: data.netROI,
                longShort: data.longShort,
                contracts: data.contracts,
                entryPrice: data.entryPrice,
                stopPrice: data.stopPrice,
                exitPrice: data.exitPrice,
                duration: data.duration,
                commission: data.commission,
                netPnL: data.netPnL,
                transactionId: data.transactionId
            });

            const user = await User.findById(userId);
            const account = user.accounts.find(acc => acc._id == accountId);
            account.trades.push(newTrade);
            const tempAccounts = user.accounts.filter(acc => acc._id != accountId);
            tempAccounts.push(account);
            await Account.updateOne({ _id: accountId }, account);
            await User.updateOne({ _id: userId }, { accounts: tempAccounts });
            await SelectedAccountModel.updateOne({ userId }, { accountId, account });
            // return {isUp:true};
            // return 
            isAllUploaded = true;
        }
    }


    const tradeGroups = {}; // To group trades by transactionId

    for (let i = 0; i < tradesWithPartiels.length; i++) {
        const transactionId = tradesWithPartiels[i]["transactionId"];
        if (!tradeGroups[transactionId]) {
            tradeGroups[transactionId] = [tradesWithPartiels[i]];
        } else {
            tradeGroups[transactionId].push(tradesWithPartiels[i]);
        }
    }

    // Process each trade group
    for (const transactionId in tradeGroups) {
        const tradeGroup = tradeGroups[transactionId];

        //Code is repeat itself need to create functions for later use
        const account = await Account.findOne({ _id: accountId });
      
        const existingTrade = account.trades.find((trd) => trd.transactionId == tradeGroup[0].transactionId);

        if (existingTrade) {
            // uploadedTradeCounter++;
            // Update existing trade's tradesHistory

            existingTrade.tradesHistory.push(...tradeGroup);

            const updatedTrade = await Trade.updateOne({ _id: existingTrade._id }, { existingTrade })

            const user = await User.findById(userId);
            const account = user.accounts.find(acc => acc._id == accountId);
            let tradesOfAccount = account.trades;
            tradesOfAccount = tradesOfAccount.filter(trade => trade.transactionId != existingTrade.transactionId);

            tradesOfAccount.push(existingTrade);
            account.trades = tradesOfAccount
            const tempAccounts = user.accounts.filter(acc => acc._id != accountId);
            tempAccounts.push(account);

            await User.updateOne({ _id: userId }, { accounts: tempAccounts });
            await Account.findByIdAndUpdate(accountId, account);
            await SelectedAccountModel.findOneAndUpdate({ _id: accountId }, { account: account });
        }
    }

    const totalLengthOfFathersTradesAndPartials = sumArrayOfLengthsAndTradeHistory(tradeGroups);
    // console.log("Counter is=", uploadedTradeCounter, "totalLengthOfFathersTradesAndPartials=", totalLengthOfFathersTradesAndPartials)


    if (!uploadedTradeCounter) {
        isAllUploaded = false;

        return { isAllUploaded, message: "All the imported trades are already exists." };
    } else if (uploadedTradeCounter >= 1 && uploadedTradeCounter < totalLengthOfFathersTradesAndPartials) {
        return { isAllUploaded, message: "Uploaded succeffully parts of the imported trades" };
    } else if (uploadedTradeCounter === totalLengthOfFathersTradesAndPartials) {
        return { isAllUploaded, message: 'Trades from Tradovate Import successfully' }
    }
}
