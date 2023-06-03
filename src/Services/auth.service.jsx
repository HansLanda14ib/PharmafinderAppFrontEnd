import axios from "axios";

const API_URL = "https://pharmafinder.up.railway.app/api/v1/auth/";

const register = (role,
                  email,
                  password,
                  firstname,
                  lastname) => {
    return axios.post(API_URL + "signup", {
        role,
        email,
        password,
        firstname,
        lastname
    });
};

const login = (email, password) => {
    return axios
        .post(API_URL + "signin", {
            email,
            password,
        })
        .then((response) => {
            if (response.data.access_token) {
                console.log(response.data)
                localStorage.setItem("user", JSON.stringify(response.data));
            }

            return response.data;
        });
};

const logout = () => {
    localStorage.removeItem("user");
    window.location.reload();
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default AuthService;