import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	user: {
		status: false
	}
};

const userSlice = createSlice({
	name: 'user',

	initialState,
	reducers: {
		login: (state, action) => {
			state.user = { ...action.payload, status: true };
		},
		logout: (state, action) => {
			state.user = { status: false };
		}
	}
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
