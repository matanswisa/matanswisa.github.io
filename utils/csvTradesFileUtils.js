import SelectedAccountModel from "../models/selectedAccount.js";
import Trade from "../models/trade.js";
import User from "../models/user.js";

const handleMergeRows = (data) => {
    // Group the rows by the 'Position ID' field
    const groupedRows = data.reduce((acc, row) => {
        const id = row['Position ID'];
        if (!acc[id]) {
            acc[id] = { ...row }; // Make a copy of the row to avoid mutation
            acc[id]['P/L'] = parseFloat(row['P/L'] || 0); // Initialize the sum of P/L
        } else {
            acc[id]['P/L'] += parseFloat(row['P/L'] || 0); // Add the P/L to the existing sum
            acc[id]['Sold Timestamp'] = row['Sold Timestamp']; // Update the 'Sold Timestamp' with the current row's value
        }
        return acc;
    }, {});
    // Convert the object back to an array
    const mergedRows = Object.values(groupedRows);

    return mergedRows;
};

export const buildTradesDataByTradovateCSV = async (csvData, userId, accountId) => {
    console.log(csvData);
    const mergedRows = handleMergeRows(csvData);
    console.log("mergedRows", mergedRows);
    const count = csvData.length; // Total number of trades
    // let successCount = 0;

    let tradesWithPartiels = [];

    for (let i = 0; i < csvData.length; i++) {

        const netROI = ((csvData[i]["Sell Price"] - csvData[i]["Buy Price"]) / csvData[i]["Buy Price"]) * 100;
        const data = {
            entryDate: csvData[i]["Bought Timestamp"] || "",
            symbol: csvData[i]["Product"] || "",
            status: csvData[i]["P/L"] < 0 ? "Loss" : csvData[i]["P/L"] > 0 ? "Win" : "Break Even",
            netROI: netROI.toFixed(2),
            stopPrice: 0,
            longShort: csvData[i]["Buy Price"] < csvData[i]["Sell Price"] ? "Long" : "Short" || "",
            contracts: csvData[i]["Bought"] || "",
            entryPrice: csvData[i]["Buy Price"] || "",
            exitPrice: csvData[i]["Sell Price"] || "",
            duration: "",
            commission: "",
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




    console.log("tradesWithPartiels.length", tradesWithPartiels.length);
    console.log("tradesWithPartiels", tradesWithPartiels);

    // const tradeGroups = {}; // To group trades by transactionId

    // for (let i = 0; i < tradesWithPartiels.length; i++) {
    //     const transactionId = tradesWithPartiels[i]["transactionId"];

    //     if (!tradeGroups[transactionId]) {
    //         tradeGroups[transactionId] = [tradesWithPartiels[i]];
    //     } else {
    //         tradeGroups[transactionId].push(tradesWithPartiels[i]);
    //     }
    // }

    for (let i = 0; i < mergedRows.length; i++) {
        const trade = mergedRows[i];

        //this code responsible to build a main trade partials we add after - 

        const netROI = ((trade["Sell Price"] - trade["Buy Price"]) / trade["Buy Price"]) * 100;
        const data = {
            entryDate: trade["Bought Timestamp"] || "",
            symbol: trade["Product"] || "",
            status: trade["P/L"] < 0 ? "Loss" : trade["P/L"] > 0 ? "Win" : "Break Even",
            netROI: netROI.toFixed(2),
            stopPrice: 0,
            longShort: trade["Buy Price"] < trade["Sell Price"] ? "Long" : "Short" || "",
            contracts: trade["Bought"] || "",
            entryPrice: trade["Buy Price"] || "",
            exitPrice: trade["Sell Price"] || "",
            duration: "",
            commission: "",
            comments: "",
            netPnL: trade["P/L"] !== undefined ? trade["P/L"] : "",
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
        const existingTrade = await Trade.findOne({ transactionId: data.transactionId });

        if (!existingTrade) {
            const newTrade = new Trade({
                // tradesHistory: tradeGroup,
                // Other properties from the first trade in the tradeGroup
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
                // ...
            });

            await newTrade.save();

            const user = await User.findById(userId);
            const account = user.accounts.find(acc => acc._id == accountId);
            account.trades.push(newTrade);
            const tempAccounts = user.accounts.filter(acc => acc._id != accountId);
            tempAccounts.push(account);
            await User.updateOne({ _id: userId }, { accounts: tempAccounts });
            await SelectedAccountModel.updateOne({ userId }, { accountId, account });
        }
    }


    // Process each trade group
    // for (const transactionId in tradeGroups) {
    //     const tradeGroup = tradeGroups[transactionId];

    //     // Find an existing trade with the same transactionId
    //     const existingTrade = await Trade.findOne({ transactionId });

    //     if (existingTrade) {
    //         // Update existing trade's tradesHistory
    //         existingTrade.tradesHistory.push(...tradeGroup);
    //         await existingTrade.save();
    //     } else {
    //         // Create a new trade with its own tradesHistory array
    //         const newTrade = new Trade({
    //             tradesHistory: tradeGroup,
    //             // Other properties from the first trade in the tradeGroup
    //             entryDate: tradeGroup[0].entryDate,
    //             symbol: tradeGroup[0].symbol,
    //             status: tradeGroup[0].status,
    //             netROI: tradeGroup[0].netROI,
    //             longShort: tradeGroup[0].longShort,
    //             contracts: tradeGroup[0].contracts,
    //             entryPrice: tradeGroup[0].entryPrice,
    //             stopPrice: tradeGroup[0].stopPrice,
    //             exitPrice: tradeGroup[0].exitPrice,
    //             duration: tradeGroup[0].duration,
    //             commission: tradeGroup[0].commission,
    //             netPnL: tradeGroup[0].netPnL,
    //             // ...
    //         });

    //         await newTrade.save();
    //         // const user = await User.findOneAndUpdate(
    //         //     { _id: userId, 'accounts._id': accountId },
    //         //     { $push: { 'accounts.$.trades': newTrade } },
    //         //     { new: true }
    //         // );
    //         const user = await User.findById(userId);
    //         const account = user.accounts.find(acc => acc._id == accountId);
    //         account.trades.push(newTrade);
    //         const tempAccounts = user.accounts.filter(acc => acc._id != accountId);
    //         tempAccounts.push(account);
    //         await User.updateOne({ _id: userId }, { accounts: tempAccounts });
    //     }
    // }


    return true;
}
