import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import fuldmagtsReducer from "../features/fuldmagts/fuldmagtsSlice";
import usersReducer from "../features/users/usersSlice";
import companyReducer from "../features/company/Companyslice";
import formReducer from "../features/formCreation/formSlice";
import ReviewFuldgmentForm from "../features/fludgmentsforms/formSlice"
const rootReducer = combineReducers({
  user: userReducer,
  dashboard: dashboardReducer,
  fuldmagts: fuldmagtsReducer,
  users: usersReducer,
  company: companyReducer,
  form: formReducer,
  reveiwForm:ReviewFuldgmentForm
});

export default rootReducer;
