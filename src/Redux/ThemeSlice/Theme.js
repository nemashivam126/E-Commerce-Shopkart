import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    theme: "Blue",
}

const ThemeSlice = createSlice({
    name: 'theme',
    initialState: initialState,
    reducers: {
        setApplicationTheme: (state, action) => {
            return {
                ...state,
                theme: action.payload
            }
        }
    }
})

export const { setApplicationTheme } = ThemeSlice.actions;
export default ThemeSlice.reducer;