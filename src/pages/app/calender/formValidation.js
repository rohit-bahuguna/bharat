export const validateUserData = (userData, validateForLogIn = false) => {
	let success = true;
	let errors = {};

	if (userData.email === '') {
		errors = {
			...errors,
			emailError: { status: true, error: 'Email id can not be Empty' }
		};
		success = false;
	}

	if (
		!userData.email.includes('@') ||
		!userData.email.includes('.') ||
		!userData.email.includes('com')
	) {
		errors = {
			...errors,
			emailError: { status: true, error: 'Invalid Email id' }
		};
		success = false;
	}

	if (userData.password.length < 8) {
		errors = {
			...errors,
			passwordError: {
				status: true,
				error: 'password should have atleast 8 character'
			}
		};
		success = false;
	}

	if (validateForLogIn) {
		if (userData.name === '') {
			errors = {
				...errors,
				nameError: { status: true, error: 'Name can not be Empty' }
			};

			success = false;
		}

		if (userData.name.length < 3) {
			errors = {
				...errors,
				nameError: {
					status: true,
					error: 'Name should have atleast 3 character'
				}
			};

			success = false;
		}

		if (!(userData.password === userData.confirmed_password)) {
			errors = {
				...errors,
				confirmPasswordError: {
					status: true,
					error: 'passsword and confirm password should be same'
				}
			};
			success = false;
		}

		if (userData.confirmed_password === '') {
			errors = {
				...errors,
				confirmPasswordError: {
					status: true,
					error: 'confirm password can not be empty'
				}
			};
			success = false;
		}
	}

	return { success, errors };
};

export const validatClassData = classData => {
	let success = true;
	let errors = {};

	if (classData.className === '') {
		errors = {
			...errors,
			classNameError: { status: true, error: 'class Name can not be empty' }
		};
		success = false;
	}

	if (typeof classData.className === 'number') {
		errors = {
			...errors,
			classNameError: { status: true, error: 'class Name can not be a number' }
		};
		success = false;
	}

	if (classData.faculty === '') {
		errors = {
			...errors,
			facultyError: { status: true, error: 'Faculty can not be empty' }
		};

		success = false;
	}

	if (classData.startDate > classData.endDate) {
		errors = {
			...errors,
			startDateError: {
				status: true,
				error: 'start Date can not be gretar then end date'
			}
		};

		success = false;
	}

	if (classData.endDate < classData.startDate) {
		errors = {
			...errors,
			endDateError: {
				status: true,
				error: 'End Date can not be less then start date'
			}
		};

		success = false;
	}

	if (classData.classHours === 0) {
		errors = {
			...errors,
			classHoursError: { status: true, error: 'class Hours  can not be Zero' }
		};

		success = false;
	}
	if (classData.classHours < 0) {
		errors = {
			...errors,
			classHoursError: {
				status: true,
				error: 'class Hours  can not less then zero'
			}
		};

		success = false;
	}

	if (classData.category === '') {
		errors = {
			...errors,
			categoryError: { status: true, error: 'category can not  be empty' }
		};

		success = false;
	}

	if (classData.description === '') {
		errors = {
			...errors,
			descriptionError: { status: true, error: 'Description can not be empty' }
		};

		success = false;
	}
	console.log(success, errors);
	return { success, errors };
};
