import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    buyNowData: null,
    isBuyNow: false,
}

const StateSlice = createSlice({
    name: 'shopkartStates',
    initialState: initialState,
    reducers: {
        setBuyNowData: (state, action) => {
            state.buyNowData = action.payload
        },
        setIsBuyNow: (state, action) => {
            state.isBuyNow = action.payload
        },
    }
})

export const { setBuyNowData, setIsBuyNow } = StateSlice.actions;
export default StateSlice.reducer;