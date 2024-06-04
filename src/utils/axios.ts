import axios, { AxiosRequestConfig } from 'axios';

// next
import { getSession } from "next-auth/react";
import * as https from 'https';
const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});
const axiosServices = axios.create({ baseURL: process.env.NEXT_API_BASE_URL || 'https://192.168.1.22:5000/', httpsAgent });
// const axiosServices = axios.create({ baseURL: 'http://192.168.1.21:5000' });
// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosServices.interceptors.request.use(
    async (config) => {
        const session = await getSession();
        if (session?.token.accessToken) {
            config.headers['Authorization'] = `Bearer ${session?.token.accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosServices.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401 && !window.location.href.includes('/login')) {
            window.location.pathname = '/login';
        }
        return Promise.reject((error.response && error.response.data) || 'Wrong Services');
    }
);

export default axiosServices;

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
    const [url, config] = Array.isArray(args) ? args : [args];
    console.log("Fetcher called with: ", url);
    const res = await axiosServices.get(url, { ...config });

    return res.data;
};

export const fetcherPost = async (args: string | [string, AxiosRequestConfig]) => {
    const [url, config] = Array.isArray(args) ? args : [args];
    const res = await axiosServices.post(url, { ...config });

    return res.data;
};
