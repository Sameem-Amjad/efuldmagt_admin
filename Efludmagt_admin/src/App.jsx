import { Provider } from "react-redux";
import store from "./redux/store";
import CustomToaster from "./components/global/CustomToaster";
import { RouterProvider } from "react-router";
import { router } from "./Router/router";
import ClipPathSVG from "./ClipPathSVG";
import '@/api/axiosConfig'
const App = () => {
  return (
    <>
      <Provider store={store}>
        <CustomToaster />
        <RouterProvider router={router} />
        <ClipPathSVG />
      </Provider>
    </>
  );
};

export default App;
