import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { setUser, clearUser } from "@/redux/features/user/userSlice"; // Assuming you have a logout action

export function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const checkTokenExpiry = (token) => {
    if (!token) return true; // If no token, consider it expired

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode the token payload
      const expiry = payload.exp * 1000; // Convert to milliseconds
      console.log("Token expiry", new Date(expiry).toLocaleString());
      return Date.now() > expiry; // Check if the token has expired
    } catch (e) {
      console.error("Error decoding token", e);
      return true; // If there's an error, consider it expired
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('authToken');

    if (storedUser && !user) {
      dispatch(setUser(storedUser)); // Update Redux state if user data exists in localStorage
    }

    if (token && checkTokenExpiry(token)) {
      dispatch(clearUser()); // Dispatch logout action if token is expired
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
    }
  }, [dispatch, user]);

  // Check if user exists (either in Redux or localStorage)
  if (!user && !localStorage.getItem('user')) {
    return <Navigate to="/login" replace />;
  }

  return children;
}