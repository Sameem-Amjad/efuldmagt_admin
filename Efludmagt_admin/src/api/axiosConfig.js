import axios from "axios";
import store from "@/redux/store"; // Import your Redux store
import { clearUser } from "@/redux/features/user/userSlice"; // Import clear user action

// Flag to prevent multiple simultaneous redirects
let isRedirecting = false;

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token && !config.skipAuth) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper function to handle the actual logout/redirect
const handleUnauthorized = () => {
  if (isRedirecting || window.location.pathname.includes("/login")) return;

  isRedirecting = true;
  
  // 1. Clear Data
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  
  // 2. Clear Redux
  store.dispatch(clearUser());
  
  // 3. Redirect
  window.location.replace("/login");

  // Reset flag after a delay to allow page load
  setTimeout(() => { isRedirecting = false; }, 2000);
};

axios.interceptors.response.use(
  (response) => {
    // ✅ CHECK 1: If backend sends "Invalid token" inside a 200 OK response
    console.log("Response Interceptor:", response);
    if (response.data && response.data.message === "Invalid token") {
      handleUnauthorized();
    }
    return response;
  },
  (error) => {
    // ✅ CHECK 2: If backend sends a 401/403 or the "Invalid token" message in error
    const message = error.response?.data?.message;
    
    if (message === "Invalid token" || error.response?.status === 401) {
      handleUnauthorized();
    }
    
    return Promise.reject(error);
  }
);

export default axios;