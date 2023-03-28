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
import { useDispatch } from 'react-redux';
import { create } from '../../../redux/feateres/classSlice';

const Calender = () => {
	const [modal, setModal] = useState(false);

	const [mockEvents, updateEvent] = useState([]);
	const [dates, setDates] = useState({
		startDate: new Date(),
		startTime: new Date(),
		endTime: new Date(),
		endDate: new Date(),
		hours: 0
	});
	console.log(dates, 'dates');
	// import functionality

	const [excelData, setExcelData] = useState([]);
	const readExcel = async e => {
		const file = e.target.files[0];
		const data = await file.arrayBuffer(file);
		const excelfile = read(data);
		const excelsheet = excelfile.Sheets[excelfile.SheetNames[0]];
		const exceljson = utils.sheet_to_json(excelsheet);
		console.log(exceljson);
		setExcelData([...exceljson]);
	};

	// time difference in the form

	const [duration, setDuration] = useState(0);

	useEffect(
		() => {
			const start = new Date(dates.startDate);
			start.setHours(dates.startTime.getHours());
			start.setMinutes(dates.startTime.getMinutes());

			const end = new Date(dates.endDate);
			end.setHours(dates.endTime.getHours());
			end.setMinutes(dates.endTime.getMinutes());

			const diff = (end - start) / (1000 * 60 * 60); // Difference in hours
			setDuration(diff);
		},
		[dates.startTime, dates.endTime]
	);

	const [theme, settheme] = useState({
		value: 'bg-danger',
		label: 'Company'
	});

	const [checkboxes, setCheckboxes] = useState([
		{
			id: 'firstCheckbox',
			label: 'Completed',
			checked: false
		},
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

	const calculateHours = () => {
		const start = dates.startDate.setHours(
			dates.startTime.getHours(),
			dates.startTime.getMinutes()
		);
		const end = dates.endDate.setHours(
			dates.endTime.getHours(),
			dates.endTime.getMinutes()
		);
		const diff = Math.abs(end - start);
		const hours = Math.floor(diff / (1000 * 60 * 60) % 24);
		setDates({ ...dates, hours: hours });
	};
	const dispatch = useDispatch();
	const toggle = () => {
		setModal(!modal);
	};
	const { errors, register, handleSubmit } = useForm();

	const handleFormSubmit = formData => {
		let newEvent = {
			id: 'default-event-id-' + Math.floor(Math.random() * 9999999),
			title: formData.Topic,
			start: new Date(),
			end: new Date(),
			description: formData.SubTopic,
			className: theme.value,
			type: theme.value
		};
		updateEvent([...mockEvents, newEvent]);
		settheme({
			value: 'fc-event-primary',
			label: 'Company'
		});
		toggle();
	};

	const showData = () => {
		dispatch(create([...excelData])); // saving to redux
		const events = [];
		excelData.map(value => {
			let newEvent = {
				id: 'default-event-id-' + Math.floor(Math.random() * 9999999),
				title: value.Topic,
				start: new Date(),
				end: new Date(),
				description: value.SubTopic,
				className: theme.value,
				type: theme.value
			};
			events.push(newEvent);
		});
		updateEvent([...events]);
	};

	const handleCheckboxChange = event => {
		const changedCheckboxId = event.target.value;
		const newCheckboxes = checkboxes.map(
			checkbox =>
				checkbox.id === changedCheckboxId
					? { ...checkbox, checked: !checkbox.checked }
					: checkbox
		);
		setCheckboxes(newCheckboxes);
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
							<Button color="info">
								<div>
									<input
										type="submit"
										className="form-control"
										value={'show data'}
										onClick={e => showData(e)}
									/>
								</div>
							</Button>
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
					<form
						className="form-validate is-alter"
						onSubmit={handleSubmit(handleFormSubmit)}>
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
											name="title"
											className="form-control"
											ref={register({ required: true })}
										/>
										{errors.title &&
											<p className="invalid">This field is required</p>}
									</div>
								</div>
							</Col>
							<Col size="12">
								<div className="form-group">
									<label className="form-label" htmlFor="event-title">
										Faculty Name
									</label>
									<div className="form-control-wrap">
										<input
											type="text"
											id="event-title"
											name="title"
											className="form-control"
											ref={register({ required: true })}
										/>
										{errors.title &&
											<p className="invalid">This field is required</p>}
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
													timeIntervals={60}
													timeCaption="Time"
													dateFormat="h:mm aa"
													className="form-control date-picker"
												/>
											</div>
										</div>
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
													timeIntervals={60}
													timeCaption="Time"
													dateFormat="h:mm aa"
													className="form-control date-picker"
												/>
											</div>
										</div>
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
											value={duration}
											disabled
										/>
									</div>
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
											ref={register({ required: true })}
										/>

										{errors.description &&
											<p className="invalid">This field is required</p>}
									</div>
								</div>
							</Col>
							<Col size="12">
								<div className="form-group">
									<label className="form-label">Class Category</label>
									<div className="form-control-wrap">
										<RSelect
											options={eventOptions}
											defaultValue={{
												value: 'fc-event-primary',
												label: 'Company'
											}}
											onChange={e => settheme(e)}
										/>
										ref={register({ required: true })}
									</div>
								</div>
							</Col>
							{/* --------------------------tick check box-------------------------------------- */}
							<Col size="12">
								<label className="form-label"> Status</label>
								<ul className="list-group list-group-horizontal gx-3 ">
									{checkboxes.map(checkbox =>
										<li className="list-group-item" key={checkbox.id}>
											<input
												className="form-check-input me-1"
												type="checkbox"
												value={checkbox.id}
												id={checkbox.id}
												onChange={handleCheckboxChange}
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
