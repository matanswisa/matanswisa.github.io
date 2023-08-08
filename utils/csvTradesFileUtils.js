import Trade from "../models/trade.js";
import User from "../models/user.js";


export const buildTradesDataByTradovateCSV = async (csvData, userId, accountId) => {
    console.log(csvData);
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

        // Find an existing trade with the same transactionId
        const existingTrade = await Trade.findOne({ transactionId });

        if (existingTrade) {
            // Update existing trade's tradesHistory
            existingTrade.tradesHistory.push(...tradeGroup);
            await existingTrade.save();
        } else {
            // Create a new trade with its own tradesHistory array
            const newTrade = new Trade({
                tradesHistory: tradeGroup,
                // Other properties from the first trade in the tradeGroup
                entryDate: tradeGroup[0].entryDate,
                symbol: tradeGroup[0].symbol,
                status: tradeGroup[0].status,
                netROI: tradeGroup[0].netROI,
                longShort: tradeGroup[0].longShort,
                contracts: tradeGroup[0].contracts,
                entryPrice: tradeGroup[0].entryPrice,
                stopPrice: tradeGroup[0].stopPrice,
                exitPrice: tradeGroup[0].exitPrice,
                duration: tradeGroup[0].duration,
                commission: tradeGroup[0].commission,
                netPnL: tradeGroup[0].netPnL,
                // ...
            });

            await newTrade.save();
            // const user = await User.findOneAndUpdate(
            //     { _id: userId, 'accounts._id': accountId },
            //     { $push: { 'accounts.$.trades': newTrade } },
            //     { new: true }
            // );
            const user = await User.findById(userId);
            const account = user.accounts.find(acc => acc._id == accountId);
            account.trades.push(newTrade);
            const tempAccounts = user.accounts.filter(acc => acc._id != accountId);
            tempAccounts.push(account);
            await User.updateOne({ _id: userId }, { accounts: tempAccounts });
        }
    }




    return true;
}
