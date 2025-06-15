import { configureStore } from "@reduxjs/toolkit";
import issueReducer from "./Users/Reducers/IssueReducer";
import UserProfileReducer from "./Users/Reducers/UserProfileReducers";
import issuesListReducer from "./Admin/reducer/IssueListreducer";
import ProfileReducer from "./Admin/reducer/ProfileReducer";
import GetUserReducer from "./Admin/reducer/GetUsersReducer";
import { ComplainReducer } from "./Users/Reducers/ComplainReducer";

const store = configureStore({
  reducer: {
    issues: issueReducer,
    issueList: issuesListReducer,
    adminProfile: ProfileReducer,
    userList: GetUserReducer,
    complainList: ComplainReducer,
    userProfile: UserProfileReducer,
  },
});

export default store;
