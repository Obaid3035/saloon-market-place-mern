import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Modal, Row } from "react-bootstrap";
import DayPicker from 'react-day-picker';
import Dropdown from 'react-dropdown';
import { connect } from "react-redux";
import * as actions from "../../../../Store/customer/actions/index";
import './Appointment.css'
import axios from "axios";
import moment from "moment-timezone";
import { NavLink } from "react-router-dom";
import { getFormattedTime } from "../../../../Helpers/vendorHelpers";
import ProgressBar from "../../../../lib/customer/ProgressBar/ProgressBar";
import inputValidation from "../Login/inputValidation";
import { Controller, useForm } from "react-hook-form";
import * as action from "../../../../Store/customer/actions";
import PhoneInput from "react-phone-input-2";
import Loader from "../../../../lib/customer/Loader/Loader";

const Appointment = props => {
	const { register, handleSubmit, formState: { errors }, control } = useForm();
	const storeId = props.match.params.id;
	const [selectedStaff, setSelectedStaff] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [showRegisterModal, setShowRegisterModal] = useState(false);
	const cart = JSON.parse(localStorage.getItem('cart'))
	const duration = cart.reduce((acc, service) => {
		return acc + parseInt(service.duration)
	}, 0)




	const [staffs, setStaffs] = useState(null);
	const [staff, setStaff] = useState(null);
	const [disabledAppointment, setDisabledAppointment] = useState([]);
	const [selectedDay, setSelectedDay] = useState(null)
	const [availableSlots, setAvailableSlots] = useState(null)
	const [selectedSlot, setSelectedSlot] = useState(null);
	let appointment;

	useEffect(() => {
		axios.get('/staffs/' + storeId)
			.then((res) => {
				setStaffs(res.data);
			})
		appointment = JSON.parse(localStorage.getItem('appointment'));
		if (appointment) {
			setSelectedStaff({
				value: appointment.staff._id, label: (
					<div className={'d-flex employee__items align-items-center'}>
						<div>
							<img alt={'profile'} width={80} height={50} src={appointment.staff.profilePicture.avatar} />
						</div>
						<div className={'pl-4 pt-3'}>
							<h6>{appointment.staff.staffName}</h6>
						</div>
					</div>
				),
			})
			setStaff(appointment.staff)
			setSelectedDay(new Date(appointment.selectedDay));
			setAvailableSlots(appointment.availableSlots)
			setSelectedSlot(appointment.selectedSlot);
		}
		window.scrollTo(0, 0)
	}, []);


	if (cart.length <= 0) {
		props.history.replace('/')
	}

	const options = [];

	if (staffs && staffs.length > 0) {
		staffs.forEach((staff) => {
			options.push({
				value: staff._id, label: (
					<div className={'d-flex employee__items align-items-center'}>
						<div>
							<img alt={'profile'} width={80} height={50} src={staff.profilePicture.avatar} />
						</div>
						<div className={'pl-4 pt-3'}>
							<h6>{staff.staffName}</h6>
						</div>
					</div>
				),
			})
		})
	}

	const handleDayClick = (day, { selected }) => {
		setSelectedDay(selected ? undefined : moment.tz(day, 'Asia/Dubai').toDate())
		const totalTime = [];
		props.cart.forEach((cart) => {
			totalTime.push(cart.duration);
		})

		const params = {
			storeId,
			day
		}

		axios.get('/time-slot/' + staff._id, {
			params
		})
			.then((res) => {
				console.log(res.data)
				setAvailableSlots(res.data)
			})

	}

	const fetchAppointment = (staffId) => {
		axios.get('/appointment/' + staffId)
			.then((res) => {
				setDisabledAppointment(res.data)
			})
	}

	const onSelect = (value) => {
		const staff = staffs.find((staff) => staff._id === value.value);
		fetchAppointment(value.value);
		setStaff(staff);
	}

	const onRemoveHandler = (serviceId, servicePrice) => {
		props.removeFromCart(serviceId, servicePrice);
	}

	const cartItems =
		cart.map((service) => (
			<Card className={'shadow-lg mt-3'}>
				<Card.Body>
					<Row className={'mt-3'}>
						<Col sm={8} className={'text-left'}>
							<h5>{service.serviceName}</h5>
							<p className={'text-muted'}>{getFormattedTime(service.duration)}</p>
						</Col>
						<Col sm={4} className={'text-right'}>
							<p style={{ color: 'red' }}>Aed {service.price}</p>
							<i className={'fas fa-times'} style={{ cursor: 'pointer' }} onClick={() => onRemoveHandler(service._id, service.price)} />
						</Col>
					</Row>
				</Card.Body>
			</Card>
		));


	const dayPicker = () => {
		let disabledDays = [];
		if (staff) {
			// disabledAppointment.forEach((date) => {
			// 	disabledDays.push(new Date(date))
			// })
			disabledDays.push({
				daysOfWeek: staff.availabilityDays,
			});
		}
		return (
			<DayPicker
				selectedDays={selectedDay}
				onDayClick={handleDayClick}
				disabledDays={[day => day < (moment().subtract(1, 'days')), { daysOfWeek: staff.availabilityDays }]}
			/>
		)
	}

	const createAppointment = () => {
		const date = moment(selectedDay).format('YYYY-MM-DD');
		console.log(date)
		const body = {
			staffId: staff._id,
			allDay: false,
			title: staff.staffName,
			slot: selectedSlot,
			date,
			duration,
			shop: storeId
		}

		const appointment = {
			body,
			staff,
			selectedDay,
			availableSlots,
			selectedSlot
		}
		localStorage.setItem('appointment', JSON.stringify(appointment));

		if (!props.isAuth) {
			setShowModal(true)
		} else {
			props.history.push('/checkout')
		}

	}


	const selectedTimeSlot = (slot) => {
		setSelectedSlot(slot);

	}

	const onFormSubmit = (data, isSignUp) => {
		const { email, password, phoneNumber } = data;
		props.onAuth(email, password, isSignUp, phoneNumber, true);
	}

	let formButtonRegister;

	formButtonRegister = (
		<>
			<Button type={'submit'} className={'header__btn login__submit w-100'}>Register</Button>
			<p className={'py-3'}>Forgot your Password?</p>
		</>
	)

	if (props.loading) {
		formButtonRegister = <Loader />
	}

	let formButton;

	formButton = (
		<>
			<Button type={'submit'} className={'header__btn login__submit w-100'}>Login</Button>
			<p className={'py-3'}>Forgot your Password?</p>
		</>
	)

	console.log("laoding", props.loading)

	if (props.loading) {
		formButton = <Loader />
	}

	let errorMessage = null;

	if (props.error) {
		errorMessage = <p className={'text-danger font-weight-bold'}>{props.error}</p>
	}

	const registerModal = (
		<Modal show={showRegisterModal} size={'md'} className={'h-100 w-100'} onHide={() => setShowRegisterModal(!showRegisterModal)} >
			<Col md={12}>
				<small className="text-center">
					{errorMessage}
				</small>
				<div className={' text-center p-4 shadow shadow-lg'}>
					<p>Have you used Thiaza before?</p>
					<NavLink to={'/login'}><Button className={'login__btn w-100'}>Login</Button></NavLink>
				</div>
				<h5 className={'text-center py-3'}>Or</h5>
				<div className={'customer__reg__modal-02 text-center px-3 pt-3 shadow shadow-lg'}>
					<Form onSubmit={handleSubmit((data) => onFormSubmit(data, true))}>
						<Controller
							name="phoneNumber"
							control={control}
							rules={inputValidation.phoneNumber}
							render={({ field: { value, onChange, ref } }) => (
								<PhoneInput
									country={'us'}
									className={'mb-1'}
									value={value}
									onChange={onChange}
								/>
							)}
						/>

						<small className="text-danger">
							{errors.phoneNumber && errors.phoneNumber.message}
						</small>
						<div className="input-group mb-2">
							<Form.Control type={'text'} placeholder={'EMAIL'} className={'detail__input__login_customer py-4'} {...register('email', inputValidation.email)} />
							<div className="input-group-append">
								<i className="zmdi zmdi-email input-group-text input__prepend__login_customer" />
							</div>
						</div>
						<small className="text-danger">
							{errors.email && errors.email.message}
						</small>
						<div className="input-group mb-2">
							<Form.Control type={'password'} placeholder={'PASSWORD'} className={'detail__input__login_customer py-4'} {...register('password', inputValidation.password)} />
							<div className="input-group-append">
								<i className="zmdi zmdi-key input-group-text input__prepend__login_customer" />
							</div>
						</div>
						<small className="text-danger">
							{errors.password && errors.password.message}
						</small>
						{formButtonRegister}
					</Form>
				</div>
			</Col>
		</Modal>
	)

	const modal = (
		<Modal show={showModal} size={'md'} className={'h-100 w-100'} onHide={() => setShowModal(!showModal)} >
			<Col sm={12}>
				<small className="text-center">
					{errorMessage}
				</small>
				<div className={'customer__appoint__top-01 text-center px-3 pt-3 shadow shadow-lg'}>
					<p>Have You used Thiaza before?</p>
					<Form onSubmit={handleSubmit((data) => onFormSubmit(data, false))}>
						<div className="input-group mb-2">
							<Form.Control type={'text'} placeholder={'EMAIL'} className={'detail__input__login_customer py-4'} {...register('email', inputValidation.email)} />

							<div className="input-group-append">
								<i className="zmdi zmdi-email input-group-text input__prepend__login_customer" />
							</div>
						</div>
						<small className="text-danger">
							{errors.email && errors.email.message}
						</small>
						<div className="input-group mb-2">
							<Form.Control type={'password'} placeholder={'PASSWORD'} className={'detail__input__login_customer py-4'} {...register('password', inputValidation.password)} />
							<div className="input-group-append">
								<i className="zmdi zmdi-key input-group-text input__prepend__login_customer" />
							</div>
						</div>
						<small className="text-danger">
							{errors.password && errors.password.message}
						</small>
						{formButton}
					</Form>
				</div>
				<h5 className={'text-center'}>Or</h5>
				<div className={'customer__login__bottom text-center p-4 shadow shadow-lg'}>
					<p>New to Thiaza?</p>
					<Button className={'login__btn w-100'} onClick={() => setShowRegisterModal(!showRegisterModal)}>Register Now</Button>
				</div>
			</Col>
		</Modal>
	)


	let shop;

	console.log(selectedDay, availableSlots, 'PROGRESS')
	if (selectedDay && !availableSlots) {
		shop = <Loader />
	}
	if (selectedDay && availableSlots && availableSlots.length <= 0) {
		shop = <p>No Slots Found</p>
	}
	if (selectedDay && availableSlots && availableSlots.length > 0) {
		shop = availableSlots.map((slot) => {

			let btn = <Button className={'appointment__btn'} onClick={() => selectedTimeSlot(slot)}>{slot}</Button>

			if (slot === selectedSlot) {
				btn = <Button className='appointment__btn__selected' onClick={() => selectedTimeSlot(slot)}>{slot}</Button>
			}

			return (
				btn
			)
		})
	}

	return (
		<div id={'checkout__section'} className={'my-5'}>
			{modal}
			{registerModal}
			<Container>
				<Row>
					<Col lg={12}>
						<Card style={{ background: '#f7f7f7' }}>
							<Card.Body>
								<Row>
									<Col lg={4}>
										<div>
											<p className={'uppercase text-muted text-left'}>Select Employee</p>
											<div className="text-left">
												<Dropdown options={options} onChange={onSelect} value={selectedStaff} placeholder="Select Employee" />
											</div>
										</div>
										<p className={'uppercase text-muted text-left mt-4'}>Select Date</p>
										<div>
											{
												staff ? dayPicker()
													: <p>Please Select an employer</p>
											}
										</div>
										<hr />
										<div className={'shadow-sm py-2'} style={{ backgroundColor: 'white' }}>
											<p className={'uppercase text-center'}>Slots Available</p>
											<div className={'text-center'}>
												{
													shop
												}
											</div>
										</div>
									</Col>
									<Col lg={7} className={'my-3'}>
										<div>
											<p className={'uppercase text-muted text-left'}>My Basket</p>
											<hr />
											{cartItems}
										</div>

										<div className={'text-right my-5'}>
											<h5 className={'uppercase'}>Order Total</h5>
											<p style={{ color: 'red' }}>Aed {props.totalPrice}</p>
										</div>
										<hr />
										{
											availableSlots && availableSlots.length > 0 && selectedSlot ?
												<button className={'uppercase btn btn-primary checkout__btn site__btn2'} onClick={createAppointment}>
													go to checkout
												</button>
												: null
										}
									</Col>
								</Row>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

const mapStateToProps = state => {
	return {
		isAuth: state.auth.isAuth,
		cart: state.cart.cart,
		totalPrice: state.cart.totalPrice,
		loading: state.auth.loading
	}
}

const mapDispatchToProps = dispatch => ({
	onAuth: (email, password, isSignUp, phoneNumber, isAppointment) => dispatch(action.auth(email, password, isSignUp, phoneNumber, isAppointment)),
	removeFromCart: (serviceId, servicePrice) => dispatch(actions.removeFromCart(serviceId, servicePrice))
})


export default connect(mapStateToProps, mapDispatchToProps)(Appointment);