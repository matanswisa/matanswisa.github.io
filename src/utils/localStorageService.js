const localStorageService = {
    store: (data, LOCAL_STORAGE_KEY = 'user') => {
        try {
            const serializedData = JSON.stringify(data);
            localStorage.setItem(LOCAL_STORAGE_KEY, serializedData);
        } catch (error) {
            console.error("Failed to store data to localStorage:", error);
        }
    },



    get: (property, LOCAL_STORAGE_KEY = "user") => {
        try {
            const serializedData = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (!serializedData) return null;

            const data = JSON.parse(serializedData);

            if (property && typeof data === "object") {
                return data[property];
            }

            return data;
        } catch (error) {
            console.error("Failed to get data from localStorage:", error);
            return null;
        }
    },

    delete: (LOCAL_STORAGE_KEY = "user") => {
        try {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        } catch (error) {
            console.error("Failed to delete data from localStorage:", error);
        }
    },
};

export default localStorageService;
