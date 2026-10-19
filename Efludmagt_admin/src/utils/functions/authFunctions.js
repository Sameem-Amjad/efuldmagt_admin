import { auth } from "../../../firebase.js";
import { confirmPasswordReset, sendPasswordResetEmail } from "firebase/auth";

export const sendPasswordReset = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

export const changePassword = async (resetCode, newPassword) => {
  await confirmPasswordReset(auth, resetCode, newPassword);
};
