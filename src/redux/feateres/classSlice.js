import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	class: []
};

const classSlice = createSlice({
	name: 'user',

	initialState,
	reducers: {
		setClass: (state, action) => {
			state.class = [...action.payload];
		},
		updateClass: (state, action) => {
			state.class = [...state.class, action.payload];
		},
		updateClassFromCsv: (state, action) => {
			state.class = [...state.class, ...action.payload];
		}
	}
});

export const { setClass, updateClass, updateClassFromCsv } = classSlice.actions;
export default classSlice.reducer;
