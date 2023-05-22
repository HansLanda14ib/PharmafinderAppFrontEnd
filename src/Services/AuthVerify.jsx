import  { useEffect } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import Notiflix from 'notiflix';

const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
        return null;
    }
};

const AuthVerify = (props) => {
    let location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (user) {
            const decodedJwt = parseJwt(user.access_token);

            if (decodedJwt.exp * 1000 < Date.now()) {
                props.logOut();
                // Notify the user that they need to log in again
                Notiflix.Notify.failure("Your session has expired. Please log in again.");
                // Redirect to the login page
                navigate("/login");
            }
        }
    }, [location, navigate, props]);

    return ;
};

export default AuthVerify;