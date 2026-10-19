import { Toaster } from "react-hot-toast";

const CustomToaster = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        className: "",
        duration: 5000,
        style: {
          background: "#363636",
          color: "#fff",
        },

        success: {
          duration: 3000,
          iconTheme: {
            primary: "#007744",
            secondary: "#fff",
          },
          style: {
            border: "1px solid #007744",
            backgroundColor: "#fff",
            color: "#007744",
          },
        },

        error: {
          duration: 3000,
          iconTheme: {
            primary: "#ff0000",
            secondary: "#fff",
          },
          style: {
            border: "1px solid #ff0000",
            backgroundColor: "#fff",
            color: "#ff0000",
          },
        },

        loading: {
          duration: 3000,
          iconTheme: {
            primary: "#007744",
            secondary: "#fff",
          },
          style: {
            border: "1px solid #007744",
            backgroundColor: "#fff",
            color: "#007744",
          },
        },
      }}
    />
  );
};

export default CustomToaster;
