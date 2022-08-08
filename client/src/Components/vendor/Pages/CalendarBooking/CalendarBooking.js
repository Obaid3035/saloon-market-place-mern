import React, {useEffect, useState} from 'react';
import {Calendar, momentLocalizer} from 'react-big-calendar';
import {Button, Col, Modal, Row} from "react-bootstrap";
import moment from 'moment-timezone';
// import events from './events';
import IntlMessages from "../../../../Util/IntlMessages";
import RctCollapsibleCard from "../../../../lib/vendor/RctCollapsibleCard/RctCollapsibleCard";
import PageTitleBar from "../../../../lib/vendor/PageTitleBar/PageTitleBar";
import { getHoursDifference } from "../../../../Helpers/vendorHelpers";
import './CalendarBooking.css'
import axios from "axios";
import { Form, FormGroup, Label } from "reactstrap";
import Select from 'react-select'
import { useForm} from "react-hook-form";
import Switch from "@material-ui/core/Switch";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AsyncSelect from "react-select/async/dist/react-select.esm";
import makeAnimated from "react-select/animated/dist/react-select.esm";
import Loader from "../../../../lib/customer/Loader/Loader";


const CalendarBooking = props => {
	const [appointment, setAppointment] = useState(null);
	const [show, setShow] = useState(false);
	const [showAddModal, setShowAddModal] = useState(false);
	const Localizer = momentLocalizer(moment);
	const [events, setEvents] = useState(null);
	const [staffInput, setStaffInput] = useState(null);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [allDay, setAllDay] = useState(null);
	const [availableSlots, setAvailableSlots] = useState([])
	const [selectedSlot, setSelectedSlot] = useState(null);



	const { register, handleSubmit, formState: { errors }, reset, control } = useForm();

	const token = localStorage.getItem('vendorToken');


	const animatedComponents = makeAnimated();




	useEffect(() => {
		axios.get('/vendor/appointments', {headers: {"Authorization": `Bearer ${token}`}})
			.then((res) => {
				console.log(res.data)
				const data = res.data.map((booking) => {
					console.log(moment(booking.start).utc(true).hour());
					const startDate = moment(booking.start).utc(true).date();
					const startMonth = moment(booking.start).utc(true).month();
					const startYear = moment(booking.start).utc(true).year();
					const startHour = moment(booking.start).utc(true).hour();
					const startMinute = moment(booking.start).utc(true).minute();
					const endDate = moment(booking.end).utc(true).date();
					const endMonth = moment(booking.end).utc(true).month();
					const endYear = moment(booking.end).utc(true).year();
					const endHour = moment(booking.end).utc(true).hour();
					const endMinute = moment(booking.end).utc(true).minute();

					const start = new Date(startYear, startMonth, startDate + 1, startHour + 1, startMinute);
					const end =  new Date(endYear, endMonth, endDate + 1, endHour + 1, endMinute);
					return {
						title: booking.title,
						start,
						end,
						slot: booking.slot,
						customerName: booking.customerName,
						customerEmail: booking.user.email,
						customerContact: booking.user.phoneNumber
					}
				})
				setEvents(data)
			});
	},[])

	const openAddModalHandler = () => {
		setShowAddModal(!showAddModal);
	}

	const openModalHandler = () => {
		setShow(!show);
	}

	const staffPromiseHandler = () =>
		new Promise(resolve => {
			axios.get('/vendor/staff', {headers: {"Authorization": `Bearer ${token}`}})
				.then((res) => {
					console.log(res.data)
					resolve(res.data)
				})
		});

	const staffChangeHandler = (staff) => {
		setStaffInput(staff);
	}

	const dataChangeHandler = (date) => {
		setSelectedDate(date);
		axios.get('/vendor/staff/' + staffInput.value, {headers: {"Authorization": `Bearer ${token}`}})
			.then((res) => {
				const params = {
					checkIn: res.data.checkIn,
					checkOut: res.data.checkOut,
					day: date
				}
				axios.get('/time-slot/' + staffInput.value , {
					params
				})
					.then((res) => {
						const slots = res.data.map((slot) => {
							return {
								value: slot,
								label: slot
							}
						});
						setAvailableSlots(slots)
					})
			})

	}

	const onDayChangeHandler = (e) => {
		setAllDay(e.target.checked);
	}

	const onFormSubmit = (e) => {
		e.preventDefault();

		const startSlot = selectedSlot.slice(0, 5);
		const endSlot = selectedSlot.slice(6,11);
		const data = {
			title: staffInput.label,
			slot: selectedSlot,
			staffId: staffInput.value,
			date: moment(selectedDate).format('YYYY-MM-DD'),
			start: moment.tz(selectedDate, 'Asia/Dubai').set({hour:startSlot.slice(0,2),minute:startSlot.slice(3,5),second:0,millisecond:0}).utc(false).toISOString(),
			end: moment.tz(selectedDate, 'Asia/Dubai').set({hour:endSlot.slice(0,2),minute:endSlot.slice(3,5),second:0,millisecond:0}).utc(false).toISOString(),
			allDay
		}
		console.log(data)

		axios.post('/appointment', data)
			.then((res) => {
				console.log(res.data)
				setShowAddModal(false);
			})
	}

	const slotChangeHandler = (slot) => {
		setSelectedSlot(slot.value);
	}

	const onDeleteHandler = () => {
		setShow(!show);
	}

	const addModal = (
		<Modal show={showAddModal} onHide={openAddModalHandler} size={'lg'}>
			<Modal.Body className={'shadow-sm'} >
				<RctCollapsibleCard heading="Add Booking">
					<Form onSubmit={onFormSubmit}>
						<FormGroup>
							<Label for="name">Staff</Label>
							<AsyncSelect
								cacheOptions
								value={staffInput}
								defaultOptions
								onChange={staffChangeHandler}
								components={animatedComponents}
								loadOptions={staffPromiseHandler}
							/>
						</FormGroup>
						{
							staffInput ? <FormGroup>
								<Label for="name">Start Date </Label><br/>
								<DatePicker
									selected={selectedDate}
									onChange={dataChangeHandler}
									name={'visible'}
									color={'default'}
									className={'text-center'}
								/>
							</FormGroup> : <p className={'text-center'}>Please Select Staff First</p>
						}

						<FormGroup>
							<Label for={'slots'}>Slots</Label>
							<Select
								options={availableSlots}
								onChange={slotChangeHandler}
							/>
						</FormGroup>

						<FormGroup>
							<Label for="name">All Day</Label>
							<Switch
								value={allDay}
								onChange={onDayChangeHandler}
								name={'allDay'}
								color={'default'}
							/>
						</FormGroup>


						<div className={'text-center'}>
							<button type={'submit'} className={'table__btn px-4'}>Add</button>
						</div>
					</Form>
				</RctCollapsibleCard>
			</Modal.Body>
		</Modal>
	)

	const modal = (
		<Modal show={show} onHide={openModalHandler} className={'shadow-sm'}>
			<Modal.Body className={'shadow-sm'} id={'calendar__modal'}>
				{
					appointment  ?
						<Row>
							<Col md={12}>
								<div className={'d-flex'}>
									<h2>Customer Name:</h2>
									<p className={'ml-3'}>{appointment.customerName}</p>
								</div>

								<div className={'d-flex'}>
									<h2>Customer Email:</h2>
									<p className={'ml-3'}>{appointment.customerEmail}</p>
								</div>

								<div className={'d-flex'}>
									<h2>Customer Contact:</h2>
									<p className={'ml-3'}>{appointment.customerContact}</p>
								</div>
								<div className={'d-flex'}>
									<h2>Employee:</h2>
									<p className={'ml-3'}>{appointment.title}</p>
								</div>
								<div className={'d-flex'}>
									<h2>OverAll hours:</h2>
									<p className={'ml-3'}>{getHoursDifference(appointment.start, appointment.end)}</p>
								</div>
								<div className={'d-flex'}>
									<h2>Slot:</h2>
									<p className={'ml-3'}>{appointment.slot}</p>
								</div>
								<div className={'d-flex'}>
									<h2>Day:</h2>
									<p className={'ml-3'}>{moment(appointment.start).format('YYYY-MM-DD')}</p>
								</div>

								<Button variant={'danger'} onClick={onDeleteHandler}>Delete</Button>
							</Col>
						</Row>
						: null
				}
			</Modal.Body>
		</Modal>
	)

	const onSelectEvent = (event) => {

		console.log(event)
		setAppointment(event);
		console.log(event)
		openModalHandler();

	}

	let calender = <Loader style={'text-center'} />;

	if (events && events.length === 0) {
		calender = <p className={'text-center'}>No Booking Found</p>
	}

	if(events && events.length > 0) {
		calender = <Calendar
			localizer={Localizer}
			selectable
			events={events}
			defaultView={'month'}
			scrollToTime={new Date(1970, 1, 1, 6)}
			defaultDate={new Date()}
			onSelectEvent={onSelectEvent}
		/>
	}
	return (
		<>
			{modal}
			{addModal}
			<div className="calendar-wrapper">
				<PageTitleBar title={<IntlMessages id="sidebar.selectable" />} match={props.match} />
				<RctCollapsibleCard
					heading="Selectable Calender"
				>
					{/*<div className={'d-flex justify-content-end pb-3'}>*/}
					{/*	<Button onClick={() => 	openAddModalHandler()}>Add Booking</Button>*/}
					{/*</div>*/}
					{
						 calender
					}
				</RctCollapsibleCard>
			</div>
		</>
	);
};

export default CalendarBooking;
