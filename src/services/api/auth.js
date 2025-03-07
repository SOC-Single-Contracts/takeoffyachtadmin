import axios from 'axios';

const API_BASE_URL = 'https://api.takeoffyachts.com/Auth';

export const signup = async (username, email, password) => {
    const response = await axios.post(`${API_BASE_URL}/SignUp/`, { Username: username, Email: email, Password: password });
    return response.data;
};

export const login = async (email, password) => {
    const response = await axios.post(`${API_BASE_URL}/Login/`, { Email: email, Password: password });
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await axios.post(`${API_BASE_URL}/ForgetPassword/`, { Email: email });
    return response.data;
};

export const resetPassword = async (userId, newPassword, resetPassword) => {
    const response = await axios.put(`${API_BASE_URL}/PasswordReset/${userId}`, { new_password: newPassword, reset_password: resetPassword });
    return response.data;
};

export const googleAuth = async (code) => {
    const response = await axios.post(`${API_BASE_URL}/GoogleSignInRedirectView/`, { code });
    return response.data;
};