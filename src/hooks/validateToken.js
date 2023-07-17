import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function useTokenValidation() {
    const navigate = useNavigate();
    const [tokenIsValid, setIsTokenValid] = useState(false);

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.get('/api/auth/validate-token', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.status === 200) setIsTokenValid(true);
                    else setIsTokenValid(false)

                } catch (error) {
                    // Token validation failed, redirect to login or handle the error
                    navigate('/login');
                }
            } else {
                // Token not found, redirect to login
                navigate('/login');
            }
        };

        validateToken();
    }, [navigate]);

    return [tokenIsValid];
}
