function filterObjectsByCurrentDate(inputArray) {
    // Create an empty array to store matching objects
    console.log("filter by date - ", inputArray);
    const filteredArray = [];

    // Get the current date as a Date object
    const currentDate = new Date();

    // Convert the currentDate to a string in 'yyyy-mm-dd' format
    const currentDateString = currentDate.toISOString().split('T')[0];

    // Iterate over the inputArray
    for (const object of inputArray) {
        // Convert the object's date to a string in 'yyyy-mm-dd' format
        const objectDateString = new Date(object.date).toISOString().split('T')[0];

        // If the object's date matches the current date, add it to the filteredArray
        if (objectDateString === currentDateString) {
            filteredArray.push(object);
        }
    }

    return filteredArray;
}

export { filterObjectsByCurrentDate };