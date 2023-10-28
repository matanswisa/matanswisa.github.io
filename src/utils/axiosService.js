import axios from "axios";
import localStorageService from "./localStorageService";


//TODO: Make all logic match to server logic.
const axiosInstance = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

const setAuthHeader = () => {
    const token = localStorageService.get('token');

    if (token) {
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
};

const createEvent = (params) => {
    axiosInstance.post('/api/event', params)
        .then(res => { console.log(res) })
        .catch(err => { console.log(err.message) });
}

axiosInstance.createEvent = (params) => {
    createEvent(params);
}

// setAuthHeader();

axiosInstance.enableAuthHeader = () => {
    setAuthHeader();
};

axiosInstance.disableAuthHeader = () => {
    delete axiosInstance.defaults.headers.common["Authorization"];
};

axiosInstance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        //TODO: Need to check if status code is 403 if it's we need to force user to logout , with a modal message.
        if (error.response && error.response.status === 401) {
            console.log(axiosInstance.defaults.headers)
            localStorageService.delete();
            axiosInstance.disableAuthHeader();
            // window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);



setAuthHeader();

export default axiosInstance;
