import api from "../api/api";
import axiosInstance from "./axiosService";


//TODO: This code not finished yet need to match it by the new messages object.
export const handleUploadTradeImage = async (tradeId, reduxUser, userId, accountId, selectedFile) => {

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('tradeId', tradeId);
    formData.append('userId', userId)
    formData.append('accountId', accountId)
    console.log("formData", formData);
    try {
        const response = await axiosInstance.post('http://localhost:8000/api/uploadTradeImage', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        // Handle success
        console.log('Upload success:', response.data);
        // return response.data;
        return response;
    } catch (error) {
        // Handle error
        console.error('Error uploading trade image:', error);
        throw error; // You might want to handle this error in the calling code
    }
};