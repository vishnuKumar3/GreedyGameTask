import { createSlice } from "@reduxjs/toolkit"

{/*This reducer is used to store the app data along with their id's */ }
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