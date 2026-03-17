import axios from 'axios';
import CryptoJS from 'crypto-js';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, 
});

const SECRET = process.env.NEXT_PUBLIC_AES_SECRET as string;

// Request Interceptor: Encrypt outgoing JSON
api.interceptors.request.use((config) => {
  if (config.data) {
    try {
      const stringifiedData = JSON.stringify(config.data);
      const encryptedPayload = CryptoJS.AES.encrypt(stringifiedData, SECRET).toString();
      // Mutate the payload to match the backend middleware expectation
      config.data = { payload: encryptedPayload };
    } catch (error) {
      console.error('Network Encryption Error:', error);
    }
  }
  return config;
}, (error) => Promise.reject(error));

// Response Interceptor: Decrypt incoming payload
api.interceptors.response.use((response) => {
  if (response.data && response.data.payload) {
    try {
      const bytes = CryptoJS.AES.decrypt(response.data.payload, SECRET);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      // Mutate the response back to raw JSON for the React components
      response.data = JSON.parse(decryptedString);
    } catch (error) {
      console.error('Network Decryption Error:', error);
    }
  }
  return response;
}, (error) => {
  return Promise.reject(error);
});

export default api;