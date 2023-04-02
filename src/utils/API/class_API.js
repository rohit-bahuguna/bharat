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

export const createClassesFromCSV = async classData => {
	const url = `${baseUrl}/createfromcsv`;

	return await axios.post(
		url,
		{ file: classData },
		{
			headers: {
				'content-Type': 'multipart/form-data'
			},
			withCredentials: true
		}
	);
};
