import { Navigate, Route, useLocation, useNavigate } from "react-router-dom";
import localStorageService from "./localStorageService";
import jwtDecode from "jwt-decode";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { isUserAuthenticated } from "../redux-toolkit/userSlice";

function PrivateRoute({ element, ...rest }) {
    const navigate = useNavigate();
    const location = useLocation();

    const isAuthenticated = useSelector(isUserAuthenticated);

    const token = localStorageService.get("token");

    function isTokenExpired(token) {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp < currentTime) {
                return true;
            }
            return false;
        } catch (e) {
            console.error("Invalid token", e);
            localStorageService.delete();
            return false;
        }
    }

    const authRule = !token || isTokenExpired(token) ? false : true;

    useEffect(() => {
        if (!authRule) {
            navigate('/login', { state: { from: location } });
        }
    }, [authRule, navigate, location]);

    return <Route
        {...rest}
        element={isAuthenticated ? element : <Navigate to="/login" replace />}
    />
}

export default PrivateRoute;