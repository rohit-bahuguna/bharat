import React, { useEffect, useState } from 'react';
import Content from '../../../layout/content/Content';
import Head from '../../../layout/head/Head';
import CalenderApp from '../../../components/partials/calender/Calender';
import DatePicker from 'react-datepicker';
import { Modal, ModalBody, ModalHeader, Button } from 'reactstrap';

import {
	Block,
	BlockBetween,
	BlockHead,
	BlockHeadContent,
	BlockTitle,
	Col,
	Icon,
	PreviewAltCard,
	Row,
	RSelect
} from '../../../components/Component';
import { eventOptions } from '../../../components/partials/calender/CalenderData';
import { useForm } from 'react-hook-form';
import { setDateForPicker } from '../../../utils/Utils';
// import { FaFileExport } from "react-icons/fa";
import { read, utils } from 'xlsx';
import { useDispatch, useSelector } from 'react-redux';
import {
	create,
	setClass,
	updateClass
} from '../../../redux/feateres/classSlice';
import { getFaculty } from '../../../utils/API/auth_API';
import { createClass, getClasses } from '../../../utils/API/class_API';
import { validatClassData } from './formValidation';

const Calender = () => {
	const allClasses = useSelector(state => state.classReducer.class);
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

	const [modal, setModal] = useState(false);
	const [mockEvents, updateEvent] = useState([]);
	const [excelData, setExcelData] = useState([]);
	const [duration, setDuration] = useState(0);
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

	const [dates, setDates] = useState({
		startDate: new Date(),
		startTime: new Date(),
		endTime: new Date(),
		endDate: new Date(),
		hours: 0
	});

	const [classData, setClassData] = useState({
		className: '',
		faculty: '',
		startDate: dates.startDate,
		endDate: dates.endDate,
		classHours: 0,
		description: '',
		category: '',
		agendas: []
	});

	//	console.log(classData.endDate < classData.startDate);
	const [error, setError] = useState({ ...initialErrors });

	const getClassData = e => {
		setError({ ...initialErrors });
		setClassData({ ...classData, [e.target.name]: e.target.value });
	};

	const getAllfaculty = async () => {
		try {
			const { data } = await getFaculty();
			const allClass = await getClasses();

			const allFaculty = data.allFaculty.map(value => {
				return { value: value._id, name: value.name };
			});
			dispatch(setClass(allClass.data.classes));
			setFaculty([...allFaculty]);
		} catch (error) {
			console.log(error);
		}
	};

	// import functionality

	const readExcel = async e => {
		const file = e.target.files[0];
		const data = await file.arrayBuffer(file);
		const excelfile = read(data);
		const excelsheet = excelfile.Sheets[excelfile.SheetNames[0]];
		const exceljson = utils.sheet_to_json(excelsheet);
		console.log(exceljson);
		setExcelData([...exceljson]);
	};

	// calculating time difference in the form
	useEffect(
		() => {
			setError({ ...initialErrors });
			const start = new Date(dates.startDate);
			start.setHours(dates.startTime.getHours());
			start.setMinutes(dates.startTime.getMinutes());

			const end = new Date(dates.endDate);
			end.setHours(dates.endTime.getHours());
			end.setMinutes(dates.endTime.getMinutes());

			const diff = (end - start) / (1000 * 60 * 60); // Difference in hours
			setClassData({ ...classData, classHours: diff });
		},
		[dates.startTime, dates.endTime]
	);

	useEffect(() => {
		getAllfaculty();
	}, []);

	const [theme, settheme] = useState({
		value: 'bg-danger',
		label: 'Company'
	});

	const dispatch = useDispatch();
	const toggle = () => {
		setModal(!modal);
	};
	const { errors, register, handleSubmit } = useForm();

	const handleFormSubmit = async e => {
		e.preventDefault();
		const { errors, success } = validatClassData(classData, dates);

		if (success) {
			try {
				const { data } = await createClass(classData);
				console.log(data);
				dispatch(updateClass(data.class));
				toggle();
			} catch (error) {
				console.log(error);
			}
		} else {
			setError({ ...error, ...errors });
		}
	};
	//'default-event-id-' + Math.floor(Math.random() * 9999999);
	const displayEventsInCalender = () => {
		// saving to redux
		const events = [];
		allClasses.map(value => {
			let newEvent = {
				id: `default-event-id-${value._id}`,
				title: value.className,
				start: value.startDate,
				end: value.endDate,
				description: value.description,
				className: theme.value,
				type: theme.value
			};
			events.push(newEvent);
		});
		updateEvent([...events]);
	};

	useEffect(
		() => {
			if (allClasses.length > 0) {
				displayEventsInCalender();
			}
		},
		[allClasses]
	);

	const handleCheckboxChange = e => {
		if (classData.agendas.includes(e.target.value)) {
			const newAgendas = classData.agendas.filter(value => {
				return e.target.value !== value;
			});

			setClassData({ ...classData, agendas: [...newAgendas] });
		} else {
			setClassData({
				...classData,
				agendas: [...classData.agendas, e.target.value]
			});
		}
	};

	const editEvent = formData => {
		let newEvents = [...mockEvents];
		const index = newEvents.findIndex(item => item.id === formData.id);
		newEvents[index] = formData;
		updateEvent(newEvents);
	};

	const deleteEvent = id => {
		let filteredEvents = mockEvents.filter(item => item.id !== id);
		updateEvent(filteredEvents);
	};

	return (
		<React.Fragment>
			<Head title="Calender" />
			<Content>
				<BlockHead size="sm">
					<BlockBetween>
						<BlockHeadContent>
							<BlockTitle page>Calendar</BlockTitle>
						</BlockHeadContent>
						<BlockHeadContent>
							<Button color="info">
								<div>
									<label className="form-label">Import Files(.csv,xlsx)</label>
									<input
										type="file"
										className="form-control"
										onChange={e => readExcel(e)}
									/>
								</div>
							</Button>
							{/* <Button color="info">
								<div>
									<input
										type="submit"
										className="form-control"
										value={'show data'}
										onClick={e => displayEventsInCalender(e)}
									/>
								</div>
							</Button> */}
						</BlockHeadContent>
						<BlockHeadContent>
							<div>
								<Button color="primary" onClick={toggle}>
									<Icon name="plus" />
									<span>Add Class</span>
								</Button>
							</div>
						</BlockHeadContent>
					</BlockBetween>
				</BlockHead>
				<Block>
					<PreviewAltCard>
						<CalenderApp
							events={mockEvents}
							onDelete={deleteEvent}
							onEdit={editEvent}
						/>
					</PreviewAltCard>
				</Block>
			</Content>
			<Modal isOpen={modal} toggle={toggle} className="modal-md">
				<ModalHeader toggle={toggle}>Add Class</ModalHeader>
				<ModalBody>
					<form className="form-validate is-alter" onSubmit={handleFormSubmit}>
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
											defaultValue={'Select Faculty'}
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
													selected={dates.startDate}
													onChange={date =>
														setDates({ ...dates, startDate: date })}
													className="form-control date-picker"
												/>
											</div>
										</div>
										<div className="w-45">
											<div className="form-control-wrap has-timepicker">
												<DatePicker
													selected={dates.startTime}
													onChange={date =>
														setDates({ ...dates, startTime: date })}
													showTimeSelect
													showTimeSelectOnly
													timeIntervals={30}
													timeCaption="Time"
													dateFormat="h:mm aa"
													className="form-control date-picker"
												/>
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
													selected={dates.endDate}
													onChange={date =>
														setDates({ ...dates, endDate: date })}
													className="form-control date-picker"
												/>
											</div>
										</div>
										<div className="w-45">
											<div className="form-control-wrap has-timepicker">
												<DatePicker
													selected={dates.endTime}
													onChange={date =>
														setDates({ ...dates, endTime: date })}
													showTimeSelect
													showTimeSelectOnly
													timeIntervals={30}
													timeCaption="Time"
													dateFormat="h:mm aa"
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
										defaultValue={'Select Category'}
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
										<Button type="submit" color="primary">
											Add Class
										</Button>
									</li>
									<li>
										<Button color="danger" className="btn-dim" onClick={toggle}>
											Discard
										</Button>
									</li>
								</ul>
							</Col>
						</Row>
					</form>
				</ModalBody>
			</Modal>
		</React.Fragment>
	);
};
export default Calender;
