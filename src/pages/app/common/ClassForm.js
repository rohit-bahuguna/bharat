import React, { useEffect, useState } from 'react';
import Content from '../../../layout/content/Content';
import Head from '../../../layout/head/Head';
import CalenderApp from '../../../components/partials/calender/Calender';
import DatePicker from 'react-datepicker';
import { Modal, ModalBody, ModalHeader, Button } from 'reactstrap';

import { Col, Row, RSelect } from '../../../components/Component';
import { eventOptions } from '../../../components/partials/calender/CalenderData';
import { useForm } from 'react-hook-form';
import { setDateForPicker } from '../../../utils/Utils';
// import { FaFileExport } from "react-icons/fa";
import { read, utils } from 'xlsx';
import { useDispatch, useSelector } from 'react-redux';
import { setClass, updateClass } from '../../../redux/feateres/classSlice';
import { getFaculty } from '../../../utils/API/auth_API';
import {
	createClass,
	getAclassById,
	adminUpdateAClassById
} from '../../../utils/API/class_API';
import { validatClassData } from '../calender/formValidation';
import { toast, ToastContainer } from 'react-toastify';

const ClassForm = ({ toggleForm, editClass = false, id = null }) => {
	const { user, classReducer } = useSelector(state => state);
	const dispatch = useDispatch();
	const initialErrors = {
		classNameError: { status: false, error: '' },
		facultyError: { status: false, error: '' },
		startDateError: { status: false, error: '' },
		endDateError: { status: false, error: '' },
		classHoursError: { status: false, error: '' },
		descriptionError: { status: false, error: '' },
		categoryError: { status: false, error: '' },
		agendasError: { status: false, error: '' }
	};

	const [faculty, setFaculty] = useState([]);

	const [checkboxes, setCheckboxes] = useState([
		{ id: 'secondCheckbox', label: 'AWP', checked: false },
		{ id: 'thirdCheckbox', label: 'Test', checked: false },
		{
			id: 'fourthCheckbox',
			label: 'Study Material Distributed',
			checked: false
		},
		{
			id: 'fifthCheckbox',
			label: 'Mentorship',
			checked: false
		}
	]);
	const [defaultValue, setDefaultValue] = useState({
		faculty: 'Select Faculty',
		category: 'Select Category'
	});
	const [classData, setClassData] = useState({
		className: '',
		faculty: '',
		startDate: new Date(),
		endDate: new Date(),
		classHours: 0,
		description: '',
		category: '',
		agendas: [],
		startTime: new Date(),
		endTime: new Date()
	});

	const [error, setError] = useState({ ...initialErrors });

	const getClassData = e => {
		setError({ ...initialErrors });
		setClassData({ ...classData, [e.target.name]: e.target.value });
	};

	const getAllfaculty = async () => {
		try {
			const { data } = await getFaculty();

			const allFaculty = data.allFaculty.map(value => {
				return { value: value._id, name: value.name };
			});

			setFaculty([...allFaculty]);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(
		() => {
			setError({ ...initialErrors });
			const start = new Date(classData.startDate);
			start.setHours(classData.startTime.getHours());
			start.setMinutes(classData.startTime.getMinutes());

			const end = new Date(classData.endDate);
			end.setHours(classData.endTime.getHours());
			end.setMinutes(classData.endTime.getMinutes());

			const diff = (end - start) / (1000 * 60 * 60); // Difference in hours
			setClassData({
				...classData,
				classHours: diff,
				startDate: start,
				endDate: end
			});
		},
		[classData.startTime, classData.endTime]
	);

	useEffect(() => {
		getAllfaculty();
	}, []);

	const getFacultyName = id => {
		const data = faculty.filter(data => data.value === id);

		return data[0].name;
	};

	const filterFaculty = id => {
		const newFaculties = faculty.filter(data => data.value !== id);
		setFaculty([...newFaculties]);
	};

	const handleCheckboxChange = e => {
		if (classData.agendas.includes(e.target.value)) {
			const newAgendas = classData.agendas.filter(value => {
				return e.target.value !== value;
			});
			const newCkeckBox = checkboxes.map(value => {
				if (!newAgendas.includes(value.label)) {
					return { ...value, ckecked: false };
				} else {
					return value;
				}
			});

			setCheckboxes([...newCkeckBox]);

			setClassData({ ...classData, agendas: [...newAgendas] });
		} else {
			setClassData({
				...classData,
				agendas: [...classData.agendas, e.target.value]
			});
			const newCkeckBox = checkboxes.map(value => {
				if (classData.agendas.includes(value.label)) {
					return { ...value, ckecked: true };
				} else {
					return value;
				}
			});
			setCheckboxes([...newCkeckBox]);
		}
	};

	const updateCheckBoxes = () => {
		const newCkeckBoxes = checkboxes.map(value => {
			if (classData.agendas.includes(value.label)) {
				console.log(value);
				return { ...value, checked: true };
			} else {
				return value;
			}
		});
		// console.log(newCkeckBoxes);
		setCheckboxes([...newCkeckBoxes]);
	};

	const handleFormSubmit = async e => {
		e.preventDefault();
		const { errors, success } = validatClassData(classData);

		if (success) {
			try {
				const { data } = await createClass(classData);

				dispatch(updateClass(data.class));
				toast.success(data.message, {
					autoClose: 1000
				});
				setTimeout(() => {
					toggleForm();
				}, 1000);
			} catch (error) {
				console.log(error);
			}
		} else {
			setError({ ...error, ...errors });
		}
	};

	const updateAClass = async e => {
		e.preventDefault();
		const { errors, success } = validatClassData(classData);

		if (success) {
			try {
				const { data } = await adminUpdateAClassById(classData, id);

				//dispatch(updateClass(data.class));
				const filteredClasses = classReducer.class.filter(
					value => value._id !== id
				);
				filteredClasses.push(data.updatedClass);
				dispatch(setClass(filteredClasses));

				toggleForm();
			} catch (error) {
				console.log(error);
			}
		} else {
			setError({ ...error, ...errors });
		}
	};

	useEffect(
		() => {
			(async () => {
				if (id) {
					try {
						const {
							data: {
								data: {
									className,
									agendas,
									category,
									classHours,
									faculty,
									endDate,
									startDate,
									description
								}
							}
						} = await getAclassById(id);

						setClassData({
							className,
							faculty,
							startDate: new Date(startDate),
							endDate: new Date(endDate),
							classHours,
							description,
							category,
							agendas,
							startTime: new Date(startDate),
							endTime: new Date(endDate)
						});
					} catch (error) {
						console.log(error);
					}
				}
			})();
		},
		[id]
	);

	useEffect(
		() => {
			if (id) {
				updateCheckBoxes();
			}
		},
		[classData]
	);

	useEffect(
		() => {
			if (id && classData.faculty !== '') {
				const name = getFacultyName(classData.faculty);
				if (name) {
					filterFaculty(id);
					setDefaultValue({
						faculty: name,
						category: classData.category
					});
				}
			}
		},
		[id, classData.faculty]
	);
	console.log(classData, faculty);
	return (
		<form className="form-validate is-alter" onSubmit={handleFormSubmit}>
			<ToastContainer />
			<Row className="gx-4 gy-3">
				<Col size="12">
					<div className="form-group">
						<label className="form-label" htmlFor="event-title">
							Class Name
						</label>
						<div className="form-control-wrap">
							<input
								type="text"
								id="event-title"
								name="className"
								className="form-control"
								onChange={getClassData}
								value={classData.className}
							/>
						</div>
						{error.classNameError.status
							? <p className="text-danger">
									{error.classNameError.error}
								</p>
							: ''}
					</div>
				</Col>
				<Col size="12">
					<div className="form-group">
						<label className="form-label" htmlFor="event-title">
							Faculty Name
						</label>
						<div className="form-control-wrap">
							<RSelect
								options={faculty}
								defaultValue={defaultValue.faculty}
								getClassData={getClassData}
								name={'faculty'}
							/>
							{error.facultyError.status
								? <p className="text-danger">
										{error.facultyError.error}
									</p>
								: ''}
						</div>
					</div>
				</Col>
				<Col sm="6">
					<div className="form-group">
						<label className="form-label">Start Date &amp; Time</label>
						<Row className="gx-2">
							<div className="w-55">
								<div className="form-control-wrap">
									<DatePicker
										selected={classData.startDate}
										onChange={date =>
											setClassData({ ...classData, startDate: date })}
										className="form-control date-picker"
									/>
								</div>
							</div>
							<div className="w-45">
								<div className="form-control-wrap has-timepicker">
									<DatePicker
										selected={classData.startTime}
										onChange={date =>
											setClassData({ ...classData, startTime: date })}
										showTimeSelect
										showTimeSelectOnly
										timeCaption="Time"
										dateFormat=" hh:mm aa"
										className="form-control date-picker"
									/>
									{/* <input
										type="time"
										onChange={e => {
											console.log(e.target.value);
										}}
									/> */}
								</div>
							</div>
							{error.startDateError.status
								? <p className="text-danger">
										{error.startDateError.error}
									</p>
								: ''}
						</Row>
					</div>
				</Col>
				<Col sm="6">
					<div className="form-group">
						<label className="form-label">End Date &amp; Time</label>
						<Row className="gx-2">
							<div className="w-55">
								<div className="form-control-wrap">
									<DatePicker
										selected={classData.endDate}
										onChange={date =>
											setClassData({ ...classData, endDate: date })}
										className="form-control date-picker"
									/>
								</div>
							</div>
							<div className="w-45">
								<div className="form-control-wrap has-timepicker">
									<DatePicker
										selected={classData.endTime}
										onChange={date =>
											setClassData({ ...classData, endTime: date })}
										showTimeSelect
										showTimeSelectOnly
										timeIntervals={30}
										timeCaption="Time"
										dateFormat="hh:mm aa"
										className="form-control date-picker"
									/>
								</div>
							</div>
							{error.endDateError.status
								? <p className="text-danger">
										{error.endDateError.error}
									</p>
								: ''}
						</Row>
					</div>
				</Col>

				<div className="row mt-2">
					<div className="col-md-12">
						<div className="form-group">
							<label className="form-label">No. of Hours</label>

							<input
								type="number"
								className="form-control"
								value={classData.classHours}
								disabled
							/>
						</div>
						{error.classHoursError.status
							? <p className="text-danger">
									{error.classHoursError.error}
								</p>
							: ''}
					</div>
				</div>

				<Col size="12">
					<div className="form-group">
						<label className="form-label" htmlFor="event-description">
							Class Description
						</label>
						<div className="form-control-wrap">
							<textarea
								className="form-control"
								id="event-description"
								name="description"
								value={classData.description}
								onChange={getClassData}
							/>
						</div>
						{error.descriptionError.status
							? <p className="text-danger">
									{error.descriptionError.error}
								</p>
							: ''}
					</div>
				</Col>
				<Col size="12 ">
					<div className="form-group">
						<label className="form-label">Class Category</label>
						<RSelect
							options={eventOptions}
							defaultValue={defaultValue.category}
							getClassData={getClassData}
							name={'category'}
						/>
						{error.categoryError.status
							? <p className="text-danger">
									{error.categoryError.error}
								</p>
							: ''}
					</div>
				</Col>
				{/* --------------------------tick check box-------------------------------------- */}
				<Col size="12" className="h-50">
					<label className="form-label"> Agendas</label>
					<ul className="list-group list-group-horizontal gx-3 ">
						{checkboxes.map(checkbox =>
							<li className="list-group-item" key={checkbox.id}>
								<input
									className="form-check-input me-1"
									type="checkbox"
									checked={checkbox.checked}
									id={checkbox.id}
									value={checkbox.label}
									name={checkbox.label}
									onClick={handleCheckboxChange}
								/>
								<label className="form-check-label" htmlFor={checkbox.id}>
									{checkbox.label}
								</label>
							</li>
						)}
					</ul>
				</Col>
				<Col size="12">
					<ul className="d-flex justify-content-between gx-4 mt-1">
						<li>
							{id === null
								? <Button type="submit" color="primary">
										Add Class
									</Button>
								: <Button onClick={updateAClass} color="primary">
										Update Class
									</Button>}
						</li>
						<li>
							<Button
								color="danger"
								className="btn-dim"
								onClick={() => toggleForm()}>
								Discard
							</Button>
						</li>
					</ul>
				</Col>
			</Row>
		</form>
	);
};

export default ClassForm;
