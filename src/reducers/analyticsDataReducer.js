import { createSlice } from "@reduxjs/toolkit"

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