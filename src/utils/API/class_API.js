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

export const getAclassById = async id => {
	const url = `${baseUrl}/getclassbyid/${id}`;
	return await axios.get(url, {
		withCredentials: true
	});
};

export const adminUpdateAClassById = async (classData, id) => {
	const url = `${baseUrl}/adminupdate/${id}`;

	return await axios.put(
		url,
		{ ...classData },
		{
			withCredentials: true
		}
	);
};

export const deleteClass = async id => {
	const url = `${baseUrl}/delete/${id}`;

	return await axios.delete(url, {
		withCredentials: true
	});
};
