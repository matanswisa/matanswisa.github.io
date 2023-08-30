
// Import trades from Tradovate CSV data, filter, sort, and process each trade
export const importTradesFromTradovate = async (csvData, userId, accountId) => {
    let trades = csvData;
    trades = removeLeadingSpaces(trades);

    const filteredTrades = filterCanceledTrades(trades);

    let sortedTrades = sortByTimestamp(filteredTrades);
    let i = 0;
    let EndIdxOfCurrTrade = 0;
    while (sortedTrades.length != 0) {  /// runing on intire data
        EndIdxOfCurrTrade = (CalcIndexsOfTradeByCsvData(sortedTrades));   //get index of end in curr trade.
        if (sortedTrades.length == (EndIdxOfCurrTrade + 1)) { //in case the reminder left we save it inside the db and setting the value of sortedTrades to empty array.
            calcTradeDataAndInsertToDb(sortedTrades, i, EndIdxOfCurrTrade);   // handle trade info and insert to db.
            sortedTrades = []
        } else {
            calcTradeDataAndInsertToDb(sortedTrades, i, EndIdxOfCurrTrade);   // handle trade info and insert to db.
            sortedTrades = DataRemovalByIdx(sortedTrades, EndIdxOfCurrTrade); // after  insert db remove from orginal data  the curr trade and going to next trade.
        }
        i++;
    }



    printTrades(sortedTrades);
}

function removeLeadingSpaces(trades) {
    for (const trade of trades) {
        for (const field in trade) {
            if (typeof trade[field] === 'string') {
                trade[field] = trade[field].trim();
            }
        }
    }
    return trades;
}


const filterCanceledTrades = (trades) => {
    for (let i = 0; i < trades.length; i++) {
        console.log(trades[0]["Status"]);
    }
    return trades.filter(trade => trade.Status !== 'Canceled');

}


const sortByTimestamp = (trades) => {
    return trades.slice().sort((a, b) => {
        const timestampA = new Date(a.Timestamp);
        const timestampB = new Date(b.Timestamp);
        return timestampA - timestampB;
    });

}
//     let endOfTradeRowIdx;
//     let diffBettwenConract = 0;



//     let sellSideSymbol = 0; // Initialize with default values
//     let buySideSymbol = 0; // Initialize with default values
//     if (trades[0]["B/S"] == ' Sell' || trades[0]["B/S"] == 'Sell' ) {
//         sellSideSymbol = 1; // Update values based on trade type
//         buySideSymbol = -1; // Update values based on trade type
//     }
//     else if (trades[0]["B/S"] == " Buy" || trades[0]["B/S"] == "Buy") {
//         buySideSymbol = 1; // Update values based on trade type
//         sellSideSymbol = -1; // Update values based on trade type
//     }

//     for (let row = 0; row < trades.length; row++) {

//         const filledQty = parseInt(trades[row]["filledQty"], 10);
//         const tradeSideSymbol = trades[row]["B/S"] == ' Sell' || trades[row]["B/S"] == 'Sell' ? sellSideSymbol : buySideSymbol;

//         // console.log(`Row ${row}: tradeSideSymbol = ${tradeSideSymbol}`); // Debug print
//         // console.log("tradesign",tradeSideSymbol);
//         diffBettwenConract += filledQty * tradeSideSymbol;
//         // console.log("sum",diffBettwenConract);
//         if (diffBettwenConract === 0) {
//             endOfTradeRowIdx = row;
//             break;
//         }
//     }


//     return endOfTradeRowIdx;
// }


const CalcIndexsOfTradeByCsvData = (trades) => {
    let endOfTradeRowIdx;
    let diffBettwenBuy = 0;
    let diffBettwenSell = 0;

    for (let row = 0; row < trades.length; row++) {

        const filledQty = parseInt(trades[row]["filledQty"], 10);

        if (trades[row]["B/S"] == ' Sell' || trades[row]["B/S"] == 'Sell' || trades[row]["B/S"] == '  Sell') {
            diffBettwenSell += filledQty;

        } else if (trades[row]["B/S"] == " Buy" || trades[row]["B/S"] == "Buy" || trades[row]["B/S"] == "  Buy") {
            diffBettwenBuy += filledQty;

        }

        if (diffBettwenBuy === diffBettwenSell) {
            endOfTradeRowIdx = row;
            break;
        }
    }

    return endOfTradeRowIdx;
}


const DataRemovalByIdx = (data, EndIdxOfCurrTrade) => {
    let newData = (data.length == EndIdxOfCurrTrade + 1) ? data.slice(EndIdxOfCurrTrade - 1, EndIdxOfCurrTrade + 1) : data.slice(EndIdxOfCurrTrade + 1);
    // if (data.length == EndIdxOfCurrTrade + 1) {
    //     data = data.slice(EndIdxOfCurrTrade + 1);

    // }
    console.log("You got sliced champ , current data-", data.length, "After I cut you big boy-", newData.length);
    return newData;
}


const calcTradeDataAndInsertToDb = (data, i, EndIdxOfCurrTrade) => {
    console.log("Trade Number : ", i + 1);
    for (let i = 0; i <= EndIdxOfCurrTrade; i++) {


        console.log(data[i]);
    }
}

const printTrades = (trades) => {
    console.log(trades);
}

