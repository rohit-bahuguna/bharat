import axios from 'axios';

const baseUrl = `http://localhost:7000/api/user`;

export const LogIn = async userData => {
	const url = `${baseUrl}/signin`;

	return await axios.post(
		url,
		{ ...userData },
		{
			withCredentials: true
		}
	);
};

export const getFaculty = async () => {
	const url = `${baseUrl}/faculty`;

	return await axios.get(url, { withCredentials: true });
};
