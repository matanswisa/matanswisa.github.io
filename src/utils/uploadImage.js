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
    // Make a POST request to the server with the file data
    const response = await axiosInstance.post('http://localhost:8000/api/uploadTradeImage', formData)
    // .then(response => response.json())
    // .then(data => {
    //     notifyToast(getMsg(messages, msgType.success, msgNumber[6]).msgText, getMsg(messages, msgType.success, msgNumber[6]).msgType);
    //     // notifyToast("Trade image uploaded successfully", "success");
    //     dispatch(setTradesList(data));
    // })
    // .catch(error => {
    //     notifyToast(getMsg(messages, msgType.errors, msgNumber[10]).msgText, getMsg(messages, msgType.errors, msgNumber[10]).msgType);
    //     // Handle any errors that occurred during the upload

    //     console.error(error);
    // });
    return response;
};