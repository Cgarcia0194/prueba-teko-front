import axios from 'axios';
import { API_URL, APP_PREFIX } from "./conn-back";
import LightStorage from "light-storage";

export const storage = new LightStorage(APP_PREFIX);

axios.defaults.baseURL = API_URL;

if (storage.get('token')) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + storage.get('token');
}

export const api = axios;