import { configureStore } from "@reduxjs/toolkit";
import AnalyticsDataReducer from "../reducers/analyticsDataReducer"
import AppDataReducer from "../reducers/appDataReducer";
import storage from "redux-persist/lib/storage"
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";

{/*Here we used persist reducer to store the data persistently i.e, we don't loss the data even if we refresh the page 
and this helps us to prevent from multiple api calls */}
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