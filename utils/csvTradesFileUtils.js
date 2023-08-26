import Account from "../models/accounts.js";
import SelectedAccountModel from "../models/selectedAccount.js";
import Trade from "../models/trade.js";
import User from "../models/user.js";




// function groupByPositionId(array) {
//     const grouped = {};

//     array.forEach(item => {
//         const positionId = item['Position ID'];

//         if (!grouped[positionId]) {
//             grouped[positionId] = [];
//         }

//         grouped[positionId].push(item);
//     });

//     return grouped;
// }


const handleMergeRows = (data) => {
     let firstBoughtTimestamp = data[0]['Bought Timestamp'];
      let firstSoldTimestamp = data[0]['Sold Timestamp'];

       const  timesObject = { time1: 0, time2: 0 };
     
        timesObject['time1'] = Math.abs(new Date(data[0]['Bought Timestamp']) - new Date(data[data.length - 1]['Sold Timestamp']));   //Time1= arr[0][buytime stamp] - arr[len-1][sold timestamp]
     
        timesObject['time2'] = Math.abs(new Date(data[0]['Sold Timestamp']) - new Date(data[data.length - 1]['Bought Timestamp']));

        
      ///  timesObject['LongShort'] = Time2 > time1 ? "Short" : "Long";
   
    // for (const id in groupedRows) {
    //     if (groupedRows.hasOwnProperty(id)) {
    //         const times = timesObject[id]

    //         // groupedRows[id]['LongShort'] = times.time2 >= times.time1  && firstSoldTimestamp < firstBoughtTimestamp ? "Short" : "Long";
    //         groupedRows[id]['LongShort'] = (times.time2 >= times.time1 && firstSoldTimestamp < firstBoughtTimestamp) ? "Short" : ((times.time1 >= times.time2 && firstBoughtTimestamp < firstSoldTimestamp) ? "Short" : "Long");
    //     }
    // }

    const groupedRows = data.reduce((acc, row) => {
        const id = row['Position ID'];
        if (row['Buy Price'] === '' || row['Sell Price'] === '' || row['P/L'] === '') {
            return acc; // Skip rows with null values
        }

        if (!acc[id]) {
            acc[id] = {
                ...row,
                'P/L': parseFloat(row['P/L'] || 0),
                'Paired Qty': parseFloat(row['Paired Qty'] || 0),
                'LongShort':(timesObject.time2 >= (timesObject.time2 >= timesObject.time1 && firstSoldTimestamp < firstBoughtTimestamp) ? "Short" : ((timesObject.time1 >= timesObject.time2 && firstBoughtTimestamp < firstSoldTimestamp) ? "Short" : "Long")),
                'Duration' : Math.max(timesObject.time1,timesObject.time2)
            };
        } else {
            acc[id]['P/L'] += parseFloat(row['P/L'] || 0);
            acc[id]['Paired Qty'] += parseFloat(row['Paired Qty'] || 0);
            acc[id]['Sold Timestamp'] = row['Sold Timestamp'];
            
        }
        return acc;

    }, {});

    return Object.values(groupedRows);
}



const handleSubTrades = (data) => {
   
    //////////////////////groups to array that conatain arrays of objects by postion id///////////////////////////
    const groupedData = {};

    data.forEach(item => {

        const positionId = item['Position ID'];
        if (!groupedData[positionId]) {
            groupedData[positionId] = [item];
        } else {
            groupedData[positionId].push(item);
        }
    });
    const result = Object.values(groupedData);
   

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const sellOrBuyPriceCount = countRepeatedPricesAndFindHighest(result);
  

    if (sellOrBuyPriceCount.highestCountSource === "sell") {
        const groupedData = {};

        data.forEach(item => {

            const positionId = item['Sell Price'];
            if (!groupedData[positionId]) {
                groupedData[positionId] = [item];
            } else {
                groupedData[positionId].push(item);
            }
        });
            // Loop through each group and add the numeric value to 'Position ID'
     
        return groupedData;
    
    } else {
        const groupedData = {};

        data.forEach(item => {

            const positionId = item['Buy Price'];
            if (!groupedData[positionId]) {
                groupedData[positionId] = [item];
            } else {
                groupedData[positionId].push(item);
            }
        });

        return groupedData;
    }

}
// This function takes an array of grouped sub-arrays, where each sub-array contains items with the same Position ID.
// It counts how many times the "Buy Price" and "Sell Price" values repeat within each sub-array and determines whether
// the highest count comes from the "sell price" or "buy price" column.
function countRepeatedPricesAndFindHighest(groupedArrays) {
    const priceCounts = {};
    let highestCount = 0;
    let highestCountKey = null;
    let highestCountSource = null;

    groupedArrays.forEach(group => {
        group.forEach(item => {
            const buyPrice = item['Buy Price'];
            const sellPrice = item['Sell Price'];

            if (buyPrice) {
                if (!priceCounts[buyPrice]) {
                    priceCounts[buyPrice] = 1;
                } else {
                    priceCounts[buyPrice]++;
                }
                if (priceCounts[buyPrice] > highestCount) {
                    highestCount = priceCounts[buyPrice];
                    highestCountKey = buyPrice;
                    highestCountSource = 'buy';
                }
            }

            if (sellPrice) {
                if (!priceCounts[sellPrice]) {
                    priceCounts[sellPrice] = 1;
                } else {
                    priceCounts[sellPrice]++;
                }
                if (priceCounts[sellPrice] > highestCount) {
                    highestCount = priceCounts[sellPrice];
                    highestCountKey = sellPrice;
                    highestCountSource = 'sell';
                }
            }
        });
    });

    return { highestCountSource };
}







    // const positionsIdsObject = groupByPositionId(data)
    // let firstBoughtTimestamp;
    // let firstSoldTimestamp;
    // const timesObject = {};
 

    // const mergedRows = Object.values(groupedRows);

    // return mergedRows;


const calcCommission = (contractName) => {
    if (contractName.includes("Micro")) {
        return 1;
    }

    return 3;
}

export const buildTradesDataByTradovateCSV = async (csvData, userId, accountId) => 
{

    const subTrades = handleSubTrades(csvData);
    let transUniqeNumber = 0;
    for (let i of Object.keys(subTrades)) {
        
        
        let father = handleMergeRows(subTrades[i]);
    
        const firstKey = Object.keys(father)[0];
       
        let commissionSize = calcCommission(father[firstKey]["Product Description"]) * -1;  
        let totalCommissionInDollars = commissionSize * father[firstKey]["Paired Qty"];
     
                
        const netROI = ((father[firstKey]["Sell Price"] - father[firstKey]["Buy Price"]) / father[firstKey]["Buy Price"]) * 100;
        const data = {
            entryDate: father[firstKey]["Bought Timestamp"] || "",
            symbol: father[firstKey]["Product"] || "",
            status: father[firstKey]["P/L"] < 0 ? "Loss" : father[firstKey]["P/L"] > 0 ? "Win" : "Break Even",
            netROI: netROI.toFixed(2),
            stopPrice: 0,   
           
            longShort: father[firstKey]["LongShort"] || "",
            contracts: father[firstKey]["Paired Qty"] || "",
            entryPrice: father[firstKey]["Buy Price"] || "",
            exitPrice: father[firstKey]["Sell Price"] || "",
            duration: "",
            commission: totalCommissionInDollars,
            comments: "",
            netPnL: father[firstKey]["P/L"] !== undefined ? father[firstKey]["P/L"] + totalCommissionInDollars : "",
            transactionId: father[firstKey]["Position ID"] + transUniqeNumber++,
        }


        

        
        const absoluteDurationInMinutes = Math.abs( father[firstKey]["Duration"]) /(1000 * 60);
        data.duration = absoluteDurationInMinutes || "";



        if (data.status == "Break Even") {

            const timeDifferenceInMinutes = (soldTimestamp - boughtTimestamp) / (1000 * 60);
            data.duration = timeDifferenceInMinutes || "";
            data.netROI = 0;
        }

        //Code is repeat itself need to create functions for later use
        const existingTrade = await Trade.findOne({ transactionId: data.transactionId });

        if (!existingTrade) {
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
            await User.updateOne({ _id: userId }, { accounts: tempAccounts });
            await SelectedAccountModel.updateOne({ userId }, { accountId, account });
        }
    

    }
}

    // let count = csvData.length; // Total number of trades
    // // let successCount = 0;

    // let tradesWithPartiels = [];

    // for (let i = 0; i < csvData.length; i++) {

    //     if (
    //         csvData[i]["Buy Price"] === "" ||
    //         csvData[i]["Sell Price"] === "" ||
    //         csvData[i]["P/L"] === "" ||
    //         csvData[i]["Bought Timestamp"] === "" ||
    //         csvData[i]["Sold Timestamp"] === ""
    //     ) {
    //         count-=1;    
    //         continue; // Skip rows with empty fields
    //     }
    //     let commissionSize = calcCommission(csvData[i]["Product Description"]) * -1;
    //     let totalCommissionInDollars = commissionSize * csvData[i]["Paired Qty"];

    //     const netROI = ((csvData[i]["Sell Price"] - csvData[i]["Buy Price"]) / csvData[i]["Buy Price"]) * 100;
    //     const data = {
    //         entryDate: csvData[i]["Bought Timestamp"] || "",    
    //         symbol: csvData[i]["Product"] || "",
    //         status: csvData[i]["P/L"] < 0 ? "Loss" : csvData[i]["P/L"] > 0 ? "Win" : "Break Even",
    //         netROI: netROI.toFixed(2),
    //         stopPrice: 0,
    //         longShort: csvData[i]["Buy Price"] < csvData[i]["Sell Price"] ? "Long" : "Short" || "",
    //         contracts: csvData[i]["Paired Qty"] || "",
    //         entryPrice: csvData[i]["Buy Price"] || "",
    //         exitPrice: csvData[i]["Sell Price"] || "",
    //         duration: "",
    //         commission: totalCommissionInDollars,
    //         comments: "",
    //         netPnL: csvData[i]["P/L"] !== undefined ? csvData[i]["P/L"] : "",
    //         transactionId: csvData[i]["Position ID"],
    //     }




    //     const boughtTimestamp = new Date(csvData[i]["Bought Timestamp"]);
    //     const soldTimestamp = new Date(csvData[i]["Sold Timestamp"]);


    //     const timeDifferenceInMinutes = (soldTimestamp - boughtTimestamp) / (1000 * 60);
    //     const absoluteDurationInMinutes = Math.abs(timeDifferenceInMinutes)
    //     data.duration = absoluteDurationInMinutes || "";



    //     if (data.status == "Break Even") {

    //         const timeDifferenceInMinutes = (soldTimestamp - boughtTimestamp) / (1000 * 60);    
    //         data.duration = timeDifferenceInMinutes || "";
    //         data.netROI = 0;
    //     }
    //     tradesWithPartiels.push(data);
    // }

    // if (!(count === tradesWithPartiels.length))
    //     throw Error("Couldn't build all trades of tradovate csv.");




    // const tradeGroups = {}; // To group trades by transactionId

    // for (let i = 0; i < tradesWithPartiels.length; i++) {
    //     const transactionId = tradesWithPartiels[i]["transactionId"];

    //     if (!tradeGroups[transactionId]) {
    //         tradeGroups[transactionId] = [tradesWithPartiels[i]];
    //     } else {
    //         tradeGroups[transactionId].push(tradesWithPartiels[i]);
    //     }
    // }

    // // Process each trade group
    // for (const transactionId in tradeGroups) {
    //     const tradeGroup = tradeGroups[transactionId];

    //     // Find an existing trade with the same transactionId
    //     const existingTrade = await Trade.findOne({ transactionId });

    //     if (existingTrade) {
    //         // Update existing trade's tradesHistory
    //         existingTrade.tradesHistory.push(...tradeGroup);
    //         await existingTrade.save();

    //         const user = await User.findById(userId);
    //         const account = user.accounts.find(acc => acc._id == accountId);
    //         let tradesOfAccount = account.trades;
    //         tradesOfAccount = tradesOfAccount.filter(trade => trade.transactionId != existingTrade.transactionId);

    //         tradesOfAccount.push(existingTrade);
    //         account.trades = tradesOfAccount
    //         const tempAccounts = user.accounts.filter(acc => acc._id != accountId);
    //         tempAccounts.push(account);

    //         await User.updateOne({ _id: userId }, { accounts: tempAccounts });
    //         await Account.findByIdAndUpdate(accountId, account);
    //         await SelectedAccountModel.findOneAndUpdate({ _id: accountId }, { account: account });
    //     }
    // }


    // return true;
// }
