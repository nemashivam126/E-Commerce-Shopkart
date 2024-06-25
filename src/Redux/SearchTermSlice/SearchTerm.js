import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    searchString: ''
}

const SearchTermSlice = createSlice({
    name: 'search',
    initialState: initialState,
    reducers: {
        setSearchTerm: (state, action) => {
            state.searchString = action.payload
        }
    }
})

export const { setSearchTerm } = SearchTermSlice.actions;
export default SearchTermSlice.reducer;