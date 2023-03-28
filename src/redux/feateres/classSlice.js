import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	class: []
};

const classSlice = createSlice({
	name: 'user',

	initialState,
	reducers: {
		create: (state, action) => {
			state.class = [...state.class, ...action.payload];
		}
	}
});

export const { create } = classSlice.actions;
export default classSlice.reducer;
