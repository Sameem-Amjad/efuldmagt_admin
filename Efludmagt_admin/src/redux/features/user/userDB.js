// src/utils/auth.js

import { staticUsers } from './staticUsers.js';
import CryptoJS from 'crypto-js';

// Secret key for encrypting tokens (ensure this is kept secure in real applications)
const SECRET_KEY = 'zain';

// Simulate token generation (for demonstration purposes only)
export const generateToken = (user) => {
  const tokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    timestamp: new Date().getTime(),
  };
  const token = CryptoJS.AES.encrypt(JSON.stringify(tokenPayload), SECRET_KEY).toString();
  return token;
};

// Sign-in Function
export const signInUserInDB = async ({ email, password }) => {
  // Simulate async operation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = staticUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        const token = generateToken(user);
        // Save token to localStorage
        localStorage.setItem('auth_token', token);
        // Save user to localStorage
        localStorage.setItem('auth_user', JSON.stringify(user));

        // Return user data without password
        const { password, ...userData } = user;
        resolve(userData);
        console.log("User Data: ", userData, "Token: ", token, "User: ", user);
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 500); // Simulate network delay
  });
};

// Get User Function
export const getUserFromDB = async (token) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!token) {
        reject(new Error('No token provided'));
        return;
      }

      try {
        const bytes = CryptoJS.AES.decrypt(token, SECRET_KEY);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        const user = staticUsers.find((u) => u.id === decryptedData.id);

        if (user) {
          const { password, ...userData } = user;
          resolve(userData);
        } else {
          reject(new Error('User not found'));
        }
      } catch (error) {
        reject(new Error('Invalid token'));
      }
    }, 500);
  });
};

// Update User Function
export const updateUserInDB = async (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { id, name, newPassword, oldPassword, profilePicture } = data;

      const userIndex = staticUsers.findIndex((u) => u.id === id);

      if (userIndex === -1) {
        reject(new Error('User not found'));
        return;
      }

      // Optional: Verify old password if changing password
      if (newPassword) {
        if (staticUsers[userIndex].password !== oldPassword) {
          reject(new Error('Old password is incorrect'));
          return;
        }
        staticUsers[userIndex].password = newPassword;
      }

      // Update name if provided
      if (name) {
        staticUsers[userIndex].name = name;
      }

      // Update profile picture if provided
      if (profilePicture?.image) {
        // For demonstration, we'll just save the image URL
        staticUsers[userIndex].profilePicture = profilePicture.image;
      }

      // Save updated user to localStorage if the user is logged in
      const currentUser = JSON.parse(localStorage.getItem('auth_user'));
      if (currentUser && currentUser.id === id) {
        const updatedUser = { ...staticUsers[userIndex] };
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      }

      const { password, ...userData } = staticUsers[userIndex];
      resolve(userData);
    }, 500);
  });
};

// Logout Function
export const logoutUser = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
};
