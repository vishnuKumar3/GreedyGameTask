import { createSlice } from "@reduxjs/toolkit"

{/*This reducer is used to store the analytics data i.e, company reports */ }
const AnalyticsDataReducer = createSlice({
    name: "AnalyticsReducer",
    initialState: [],
    reducers: {
        addAnalyticsData(state, action) {
            state.push(action.payload)
        }
    }
})

export const { addAnalyticsData } = AnalyticsDataReducer.actions
export default AnalyticsDataReducer.reducer