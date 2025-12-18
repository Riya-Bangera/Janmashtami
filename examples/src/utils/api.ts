import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const APP_ID = import.meta.env.VITE_APP_ID;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "X-App-Id": APP_ID,
  },
});

// 响应拦截器，处理错误
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API 请求错误:", error);
    return Promise.reject(error);
  }
);

// API 统一方法封装
const api = {
  // 发送短信验证码
  sendSmsCode: (data: { phone: string; sessionId: string }) => 
    apiClient.post("/api/miaoda/runtime/apicenter/source/proxy/hch5WXYwg5jJEnjQw5nYCR", data),
  
  // 验证短信验证码
  verifySmsCode: (data: { sessionId: string; phoneCode: string; phone: string }) => 
    apiClient.post("/api/miaoda/runtime/apicenter/source/proxy/7mph9XQDXoJXmSvGCAhBEi", data),
};

export default api;