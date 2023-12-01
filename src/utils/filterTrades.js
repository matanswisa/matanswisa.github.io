function areDatesEqual(entryDate, currentDate) {
    const entryYear = entryDate.getFullYear();
    const entryMonth = entryDate.getMonth();
    const entryDay = entryDate.getDate();

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    return entryYear === currentYear && entryMonth === currentMonth && entryDay === currentDay;
}


function filterObjectsByCurrentDate(trades) {

    const currentDate = new Date(); // Get the current date and time

    const tradesOfToday = trades.filter((trade) => {
        // Split the entryDate string by 'T' to get the date component
        const entryDateParts = trade.entryDate.split('T');

        // Parse the date portion into a Date object
        const entryDate = new Date(entryDateParts[0]);

        // Compare the entryDate with currentDate to check if it's from today or later
        return areDatesEqual(entryDate, currentDate);
    });

    return tradesOfToday;
}

const filterTradesWithLosses = (trades) => {
    const lossTrades = trades.filter((trade) => trade.status === 'Loss');
    return lossTrades.length;
}


export { filterObjectsByCurrentDate, filterTradesWithLosses }