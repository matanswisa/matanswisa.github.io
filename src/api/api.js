import axios from 'axios';

const baseURL = `http://localhost:8000`

export const axiosAuth = axios.create({
    baseURL
})

export default axios.create({
    baseURL
})


