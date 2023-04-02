import React, { useEffect, useState } from 'react';
import Content from '../../../layout/content/Content';
import Head from '../../../layout/head/Head';
import CalenderApp from '../../../components/partials/calender/Calender';
import { Modal, ModalBody, ModalHeader, Button } from 'reactstrap';
import {
	Block,
	BlockBetween,
	BlockHead,
	BlockHeadContent,
	BlockTitle,
	Icon,
	PreviewAltCard
} from '../../../components/Component';

import { useSelector } from 'react-redux';

import ClassForm from '../common/ClassForm';
import DropZone from '../common/DropZone';
import { getClasses } from '../../../utils/API/class_API';
import { useDispatch } from 'react-redux';
import { setClass } from '../../../redux/feateres/classSlice';

const Calender = () => {
	const allClasses = useSelector(state => state.classReducer.class);

	const [modal, setModal] = useState({
		form: false,
		csv: false
	});
	const dispatch = useDispatch();
	const [mockEvents, updateEvent] = useState([]);

	const [theme, settheme] = useState({
		value: 'bg-danger',
		label: 'Company'
	});

	const toggleForm = () => {
		setModal({ form: !modal.form, csv: false });
	};

	const toggleCsvForm = () => {
		setModal({ form: false, csv: !modal.csv });
	};

	const displayEventsInCalender = () => {
		// showing events in calender
		const events = [];
		allClasses.map(value => {
			let newEvent = {
				id: `default-event-id-${value._id}`,
				title: value.className,
				start: value.startDate,
				end: value.endDate,
				description: value.description,
				className: theme.value,
				type: theme.value,
				faculty: value.faculty
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

	useEffect(() => {
		(async () => {
			try {
				const allClass = await getClasses();
				dispatch(setClass(allClass.data.classes));
			} catch (error) {
				console.log(error);
			}
		})();
	}, []);

	return (
		<React.Fragment>
			<Head title="Calender" />
			<Content>
				<BlockHead size="sm">
					<BlockBetween>
						<BlockHeadContent>
							<BlockTitle page>Calendar</BlockTitle>
						</BlockHeadContent>
						<BlockHeadContent />
						<BlockHeadContent>
							<div>
								<Button color="primary" onClick={toggleForm}>
									<Icon name="plus" />
									<span>Add Class</span>
								</Button>
								<Button color="primary" onClick={toggleCsvForm}>
									<Icon name="plus" />
									<span>Insert CSV</span>
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

			{/* form modal */}
			<Modal isOpen={modal.form} toggle={toggleForm} className="modal-md">
				<ModalHeader toggle={toggleForm}>Add Class</ModalHeader>
				<ModalBody>
					<ClassForm toggleForm={toggleForm} />
				</ModalBody>
			</Modal>
			{/* csv modal */}
			<Modal isOpen={modal.csv} toggle={toggleCsvForm} className="modal-md">
				<ModalHeader toggle={toggleCsvForm}>Insert Csv</ModalHeader>
				<ModalBody>
					<DropZone toggleCsvForm={toggleCsvForm} />
				</ModalBody>
			</Modal>
		</React.Fragment>
	);
};
export default Calender;
