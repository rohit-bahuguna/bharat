export const getFacultyName = (id, faculty) => {
	const data = faculty.filter(data => data.value === id);

	return data[0].name;
};
