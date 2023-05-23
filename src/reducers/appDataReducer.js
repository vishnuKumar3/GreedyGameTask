import { createSlice } from "@reduxjs/toolkit"

const AppDataReducer = createSlice({
    name: "AppDataReducer",
    initialState: [],
    reducers: {
        addAppData(state, action) {
            state.push(action.payload)
        }
    }
})

export const { addAppData } = AppDataReducer.actions
export default AppDataReducer.reducer