import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import bootstrapPlugin from '@fullcalendar/bootstrap5';
import DatePicker from 'react-datepicker';
import {
	Popover,
	PopoverHeader,
	PopoverBody,
	ModalHeader,
	Modal,
	ModalBody,
	Button
} from 'reactstrap';
import { useForm } from 'react-hook-form';
import { Col, Row, RSelect } from '../../Component';
import { setDateForPicker } from '../../../utils/Utils';
import { eventOptions, returnDate } from './CalenderData';
import ClassForm from '../../../pages/app/common/ClassForm';
import { deleteClass } from '../../../utils/API/class_API';
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setClass } from '../../../redux/feateres/classSlice';
import { getFacultyName } from '../../../utils/helper/helperFunctions';

const EventView = event => {
	const [mouseEnter, setMouseEnter] = useState(false);
	const { title, extendedProps, publicId } = event.event.event._def;
	return (
		<React.Fragment>
			<div
				id={publicId}
				onMouseEnter={() => setMouseEnter(true)}
				onMouseLeave={() => setMouseEnter(false)}>
				{title}
			</div>{' '}
			<Popover placement="bottom" isOpen={mouseEnter} target={publicId}>
				<PopoverHeader>
					{title}
				</PopoverHeader>
				<PopoverBody>
					{extendedProps.description}
				</PopoverBody>
			</Popover>
		</React.Fragment>
	);
};

const CalenderApp = ({ events, onDelete, onEdit }) => {
	const allClasses = useSelector(state => state.classReducer.class);
	const [modalState, updateModal] = useState(false);
	const [mockEvents, updateEvents] = useState(events);
	const [event, updateEvent] = useState({});
	const [theme, settheme] = useState();
	const [edit, updateEditModal] = useState(false);
	const [dates, setDates] = useState({
		startDate: new Date(),
		startTime: new Date(),
		endTime: new Date(),
		endDate: new Date()
	});

	useEffect(
		() => {
			updateEvents(events);
		},
		[events]
	);
	const dispatch = useDispatch();
	const { errors, register, handleSubmit } = useForm();

	const handleFormSubmit = formData => {
		let newEvent = {};
		newEvent = {
			id: event.id,
			className: theme.value,
			type: theme,
			title: formData.title,
			start: event.start,
			end: event.end,
			description: formData.description
		};
		onEdit(newEvent);
		settheme('');
		toggleEdit();
	};
	console.log(event.end, event.start);
	const toggle = () => {
		updateModal(!modalState);
	};

	const toggleEdit = () => {
		updateEditModal(!edit);
	};

	const handleEventClick = info => {
		const event = events.find(item => item.id === info.event._def.publicId);
		console.log(event);
		updateEvent(event);
		settheme(event.type);
		toggle();
	};

	const deleteAClass = async () => {
		try {
			if (event.id) {
				const { data } = await deleteClass(event.id.split('-')[3]);
				const updatedClasses = allClasses.filter(
					value => value._id !== event.id.split('-')[3]
				);

				toast.success(data.message, {
					autoClose: 1000
				});
				dispatch(setClass(updatedClasses));
				setTimeout(() => {
					toggle();
				}, 1000);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<ToastContainer />
			<FullCalendar
				plugins={[dayGridPlugin, timeGridPlugin, listPlugin, bootstrapPlugin]}
				events={mockEvents}
				eventClick={info => handleEventClick(info)}
				initialView="dayGridMonth"
				headerToolbar={{
					left: 'title prev,next',
					center: null,
					right: 'today dayGridMonth,timeGridWeek,timeGridDay,listWeek'
				}}
				themeSystem="bootstrap5"
				height={800}
				contentHeight={780}
				eventContent={e => <EventView event={e} />}
				aspectRatio={3}
				editable={true}
				droppable={true}
			/>

			<Modal isOpen={modalState} toggle={toggle} className="modal-md">
				<ModalHeader
					className={event.className && event.className}
					toggle={toggle}>
					{event.title && event.title}
					{/* {event.faculty && event.faculty} */}
					{/* getFacultyName(event.faculty ) */}
				</ModalHeader>
				<ModalBody>
					<Row className="gy-3 py-1">
						<Col sm="6">
							<h6 className="overline-title">Start Time</h6>
							<p id="preview-event-start">
								{event.start && event.start.split('T')[0]}
							</p>
						</Col>
						<Col sm="6" id="preview-event-end-check">
							<h6 className="overline-title">End Time</h6>
							<p id="preview-event-end">
								{event.end && event.end.split('T')[0]}
							</p>
						</Col>
						<Col sm="10" id="preview-event-description-check">
							<h6 className="overline-title">Description</h6>
							<p id="preview-event-description">
								{event.description && event.description}
							</p>
						</Col>
					</Row>
					<ul className="d-flex justify-content-between gx-4 mt-3">
						<li>
							<Button
								color="primary"
								onClick={() => {
									toggle();
									toggleEdit();
								}}>
								Edit Class
							</Button>
						</li>
						<li>
							<Button color="danger" className="btn-dim" onClick={deleteAClass}>
								Delete
							</Button>
						</li>
					</ul>
				</ModalBody>
			</Modal>
			<Modal isOpen={edit} toggle={toggleEdit} className="modal-md">
				<ModalHeader toggle={toggleEdit}>Edit Class</ModalHeader>
				<ModalBody>
					{event.id &&
						<ClassForm
							toggleForm={toggleEdit}
							editClass={true}
							id={event.id.split('-')[3]}
						/>}
				</ModalBody>
			</Modal>
		</>
	);
};

export default CalenderApp;
