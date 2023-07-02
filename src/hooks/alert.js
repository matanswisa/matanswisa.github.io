import { useState } from 'react';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';

const useToast = () => {

    const [toastId, setToastId] = useState(null);

    const showToast = (message, type = 'info', options = {}) => {
        if (toastId) {
            toast.dismiss(toastId);
        }

        const newToastId = toast[type](message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            ...options,
        });

        setToastId(newToastId);
    };
    return showToast;
}

export default useToast;