import { combineReducers, configureStore } from "@reduxjs/toolkit";

// Slice's
import authReducer from "@/store/slice/auth-slice";

const reducer = combineReducers({
  auth: authReducer,
});

const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
