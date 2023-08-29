

export const importTradesFromTradovate = async (csvData, userId, accountId) => {
    const trades = csvData;
    const filteredTrades = filterCanceledTrades(trades);
    const sortedTrades = sortByTimestamp(filteredTrades);
    printTrades(sortedTrades);




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


const printTrades = (trades) => {
    console.log(trades);
}

