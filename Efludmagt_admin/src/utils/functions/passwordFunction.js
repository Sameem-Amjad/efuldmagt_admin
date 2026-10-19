import CryptoJS from "crypto-js";

export const getPasswordFromLocalStorage = () => {
  const encryptedPassword = localStorage.getItem("tal_user_password");
  if (encryptedPassword) {
    const bytes = CryptoJS.AES.decrypt(
      encryptedPassword,
      import.meta.env.VITE_SECRET_KEY
    );
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
    return originalPassword;
  }
  return null;
};

export const savePasswordToLocalStorage = (password) => {
  const encryptedPassword = CryptoJS.AES.encrypt(
    password,
    import.meta.env.VITE_SECRET_KEY
  ).toString();
  localStorage.setItem("tal_user_password", encryptedPassword);
};
