import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import "./Account.css";
import ReactStars from "react-rating-stars-component";
import { Button, Col, Modal, ModalBody, Row, Form } from "react-bootstrap";
import Loader from "../../../../lib/customer/Loader/Loader";
import { MdLocationOn } from 'react-icons/md'

function CompletedAppointment() {
	const monthNames = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];

	const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	const token = localStorage.getItem('token');
	const [booking, setBooking] = useState(null);
	const [customerName, setCustomerName] = useState('');
	const [shopId, setShopId] = useState("");
	const [show, setShow] = useState(false);
	const [starRating, setStarRating] = useState(1)
	const [error, setError] = useState(false)
	const [comment, setComment] = useState("")
	const [submitLoader, setSubmitLoader] = useState(false);
	const [appointmentId, setAppointmentId] = useState(null)



	useEffect(() => {
		axios.get('/completed-appointments', { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				console.log("hello", res.data.shop)
				setBooking(res.data);
			})
	}, [!submitLoader])

	const handleClose = () => setShow(false);



	const handleShow = (myAppointment) => {
		setShow(true);
		console.log('AppointmentID', myAppointment._id)
		setCustomerName(myAppointment.customerName);
		setAppointmentId(myAppointment._id);
		setShopId(myAppointment.shop._id)
	}

	const handleModalForm = (e) => {
		setSubmitLoader(true)
		e.preventDefault()
		if (comment === "") {
			setError(true)
		}
		axios.post("review/" + appointmentId, {
			"customerName": customerName,
			"rating": starRating,
			"comment": comment,
			"shop": shopId
		}).then((res) => {
			console.log(res)
			setSubmitLoader(false)
			setShow(false)
		}).catch((err) => {
			console.log(err.message)
			setSubmitLoader(false)
		})
	}

	let errorMessage;

	if (error) {
		errorMessage = (
			<small style={{ color: "red" }}>
				Must Fill Comment
			</small>
		)
	}


	let btn;
	if (submitLoader) {
		btn = (
			<Loader style={'text-center'} />
		)

	} else {
		btn = <div className="text-center">
			<Button type="submit" className="">Submit</Button>
		</div>
	}


	const modal = (
		<Modal show={show} size={'lg'} id={'service__modal'}>
			<Modal.Header>
				<Modal.Title className={'uppercase white bold'}>Reviews</Modal.Title>
				<Modal.Title style={{ cursor: "pointer" }} className={'uppercase white bold'} onClick={handleClose} >x</Modal.Title>
			</Modal.Header>
			<ModalBody className={'px-5'}>
				<Row className={'mt-4'}>
					<Col className={'appointment__model'}>
						<h3 className={'text-center '}>Write a Review</h3>
						<p className={'mt-5'}>overall Rating</p>

					</Col>

				</Row>
				<Form onSubmit={handleModalForm}>
					<div className="text-center d-flex justify-content-center">
						<ReactStars
							count={5}
							value={starRating}
							half={true}
							size={24}
							activeColor="#ffd700"
							onChange={(val) => setStarRating(val)}
						/>
					</div>
					<Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
						<Form.Label className={'comment-head'} >COMMENTS</Form.Label>
						<Form.Control as="textarea" rows={3} className={'comment'} value={comment} onChange={(e) => setComment(e.target.value)} />
					</Form.Group>
					{errorMessage}

					{btn}
				</Form>
			</ModalBody>
		</Modal>
	)



	let appointment = (
		<div className={'progress__bar'}>
			<Loader />
		</div>
	);

	if (booking && booking.length > 0) {

		appointment = (
			<>
				<div className="row justify-content-center">
					{
						booking.map((appointment) => {
							const date = new Date(appointment.date)

							console.log(appointment)

							return (
								<>
									<div className="col-md-10">
										{modal}
										<Col className={'mt-3 shadow p-4'} >
											<Row>
												<Col md={4} className={'text-center hide-img-my-appoint'}>
													<img alt={'shopImage'} src={appointment.shop.shopImage.avatar} className={'w-100 img-fluid'} />
												</Col>
												<Col md={8} className={'right__section p-4 d-lg-block d-md-none d-none'}>
													<div className={'d-flex justify-content-between align-items-center'}>
														<div>
															<h3 style={{ fontWeight: "bold" }} className="pb-2">{appointment.shop.shopName}</h3>
															<div className="d-flex align-items-center p-0 m-0">
																<MdLocationOn color={"grey"} size={20} />
																<p style={{ fontSize: "16px", color: "grey", textDecoration: "underline" }} className="p-0 m-0">{appointment.shop.address}</p>
															</div>
														</div>

													</div>

													<div className="mt-4 d-flex justify-content-between align-items-center">
														<div>
															<h6 className="font-weight-bold">Aed <span>{appointment.totalPrice}</span></h6>
														</div>
														<div>
															<div className="d-flex">
																<h5 style={{ fontWeight: "bolder" }}>{appointment.slot}</h5>
																<h5>{monthNames[date.getMonth()]} {date.getDate()} {dayOfWeek[date.getDay()]}</h5>
																<Button className="btn" onClick={() => handleShow(appointment)}>Reviews</Button>
															</div>
														</div>
													</div>
												</Col>

												<Col md={8} className={'right__section p-4 d-lg-none d-md-block d-none'}>
													<div className={'d-flex justify-content-between align-items-center'}>
														<div>
															<h3 style={{ fontWeight: "bold" }} className="pb-2">{appointment.shop.shopName}</h3>
															<div className="d-flex align-items-center p-0 m-0">
																<MdLocationOn color={"grey"} size={20} />
																<p style={{ fontSize: "16px", color: "grey", textDecoration: "underline" }} className="p-0 m-0">{appointment.shop.address}</p>
															</div>
														</div>
														<h3 style={{ fontWeight: "bolder" }} className="pt-2">{appointment.slot}</h3>
														<div>
															<h5 className="pb-2">{monthNames[date.getMonth()]} {date.getDate()}</h5>
															<h5>{dayOfWeek[date.getDay()]}</h5>
														</div>
													</div>

													<div className="mt-4 d-flex justify-content-between align-items-center">
														<div>
															<h6 className="font-weight-bold">Aed <span>{appointment.totalPrice}</span></h6>
														</div>
														<div>
															<Button className="btn" onClick={() => handleShow(appointment)}>Reviews</Button>
														</div>
													</div>
												</Col>

												<Col md={8} className={'right__section d-lg-none d-md-none d-block m-0 p-0'} style={{ borderRadius: "5px" }}>
													<div style={{ background: "black", borderTopLeftRadius: "5px", borderTopRightRadius: "5px" }}>
														<p style={{ color: "#fff" }} className="p-3 text-center">{dayOfWeek[date.getDay()]} {date.getDate()} {monthNames[date.getMonth()]}</p>
													</div>
													<div className="ml-2">
														<h1 style={{ fontWeight: "bold" }} className="pb-2">{appointment.shop.shopName}</h1>
													</div>
													<div className="ml-1 d-flex align-items-center p-0 m-0">
														<MdLocationOn color={"grey"} size={20} />
														<p style={{ fontSize: "16px", color: "grey", textDecoration: "underline" }} className="p-0 m-0">{appointment.shop.address}</p>
													</div>
													<div className="ml-2 mt-4 mb-3 d-flex justify-content-between align-items-center">
														<h6 className="font-weight-bold mt-2">Aed <span>{appointment.totalPrice}</span></h6>
														<Button className="btn mr-2" onClick={() => handleShow(appointment)}>Reviews</Button>
													</div>
												</Col>
											</Row>
										</Col>
									</div>
								</>
							)
						})
					}
				</div>

			</>
		);
	}

	if (booking && booking.length === 0) {
		appointment = (
			<>

				<div>
					<div className="container appointment">
						<div className="pt-5">
							<p className="card-text">My appointments</p>
							<div className="card w-100">
								<div className="card-body">
									<p className="card-text">You haven't completed an appointment yet</p>
									{/*<a href="#" className="btn ">Make an Appointment</a>*/}
								</div>
							</div>
						</div>

					</div>
				</div>
			</>
		)
	}

	return (
		<>
			<div className={'appointment__section'}>
				{appointment}
			</div>
		</>
	)
}

export default CompletedAppointment