import { configureStore } from "@reduxjs/toolkit";
import AnalyticsDataReducer from "../reducers/analyticsDataReducer"
import AppDataReducer from "../reducers/appDataReducer";
import storage from "redux-persist/lib/storage"
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";

const persistConfig = {
    key: "root",
    version: 1,
    storage
}

const combinedReducers = combineReducers({
    analytics: AnalyticsDataReducer,
    appData: AppDataReducer
})

const persistedReducer = persistReducer(persistConfig, combinedReducers)

const store = configureStore({
    reducer: persistedReducer
})

export default store