import axios from 'axios';
const baseUrl = `http://localhost:7000/api/class`;

export const createClass = async classData => {
	const url = `${baseUrl}/create`;

	return await axios.post(
		url,
		{ ...classData },
		{
			withCredentials: true
		}
	);
};

export const getClasses = async () => {
	return await axios.get(baseUrl, {
		withCredentials: true
	});
};
