import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    snackbarOpen: false,
    snackbarSeverity: "",
    snackbarMessage: ""
}

const SnackBarSlice = createSlice({
    name: "snackbar",
    initialState: initialState,
    reducers: {
        addSnackbarState: (state, action) => {
            state.snackbarOpen = action.payload.snackbarOpen;
            state.snackbarMessage = action.payload.snackbarMessage;
            state.snackbarSeverity = action.payload.snackbarSeverity;
        },
    }
})

export const { addSnackbarState } = SnackBarSlice.actions;
export default SnackBarSlice.reducer;

