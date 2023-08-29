
// Import trades from Tradovate CSV data, filter, sort, and process each trade
export const importTradesFromTradovate = async (csvData, userId, accountId) => {
    const trades = csvData;
    const filteredTrades = filterCanceledTrades(trades);
    let sortedTrades = sortByTimestamp(filteredTrades);
  
    for(let i = 0 ;i < sortedTrades.length; i++){  /// runing on intire data

        let EndIdxOfCurrTrade = (CalcIndexsOfTradeByCsvData(sortedTrades));   //get index of end in curr trade.
     
        calcTradeDataAndInsertToDb(sortedTrades,i,EndIdxOfCurrTrade);   // handle trade info and insert to db.
        sortedTrades = DataRemovalByIdx(sortedTrades, CalcIndexsOfTradeByCsvData(sortedTrades)); // after  insert db remove from orgingal data curr trade and going to next trade.
       
    }

  //  printTrades(sortedTrades);
}




const filterCanceledTrades = (trades) => {
    return trades.filter(trade => trade.Status !== ' Canceled');
}


const sortByTimestamp = (trades) => {
    return trades.slice().sort((a, b) => {
        const timestampA = new Date(a.Timestamp);
        const timestampB = new Date(b.Timestamp);
        return timestampA - timestampB;
    });

}
// const CalcIndexsOfTradeByCsvData = (trades) => {
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
        if (trades[row]["B/S"] === ' Sell' || trades[row]["B/S"] === 'Sell') {
            diffBettwenSell += filledQty;
        } else if (trades[row]["B/S"] === " Buy" || trades[row]["B/S"] === "Buy") {
            diffBettwenBuy += filledQty;
        }

        if (diffBettwenBuy === diffBettwenSell) {
            endOfTradeRowIdx = row;
            break;
        }
    }

    return endOfTradeRowIdx;
}


const DataRemovalByIdx = (data,EndIdxOfCurrTrade ) => 
{
    const newData = data.slice(EndIdxOfCurrTrade + 1);
    return newData; 
}


const calcTradeDataAndInsertToDb = (data,i,EndIdxOfCurrTrade) =>
{
    console.log("trade number ",i+1 ," indexes  is from  0 to :" ,  EndIdxOfCurrTrade);
}

const printTrades = (trades) => {
    console.log(trades);
}

