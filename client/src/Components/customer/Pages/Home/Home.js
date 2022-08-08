import React, { useState, useEffect } from 'react';
import AboutImg from '../../../../assets/customer/img/homepage-about-image.png';
import lineImg from '../../../../assets/customer/img/line_img.png';
import serviceImg1 from '../../../../assets/customer/img/service (1).png';
import serviceImg2 from '../../../../assets/customer/img/service (2).jpeg';
import serviceImg3 from '../../../../assets/customer/img/service (3).png';
import serviceImg4 from '../../../../assets/customer/img/smile-dentist.png';
import serviceImg5 from '../../../../assets/customer/img/spa.png';
import icon1 from '../../../../assets/customer/img/reminder.png'
import icon2 from '../../../../assets/customer/img/tick.png'
import icon3 from '../../../../assets/customer/img/book-now.png'
import icon4 from '../../../../assets/customer/img/two-four.png'
import lineImg2 from '../../../../assets/customer/img/line__img2.png'
import Layer from '../../../../assets/customer/img/Layer 1.png'
import './Home.css'
import axios from "axios";
import FeaturedCarousel from "../../../../lib/customer/FeaturedCarousel/FeaturedCarousel"
import { Col, Container, Row, Form, Button, Card, Accordion, Modal } from "react-bootstrap";
import Loader from "../../../../lib/customer/Loader/Loader";
import { NavLink } from "react-router-dom";
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";

const Home = (props) => {
	const services = ['Aesthetic Doctor', 'Dentist', 'Beautician', 'Hairdresser', 'Barbers', 'Spa'];
	const [loading, setLoading] = useState(false);
	const [value, setValue] = useState(null);
	const [show, setShow] = useState(false);
	const [error, setError] = useState(false)
	const [searchState, setSearchState] = useState({
		serviceType: '',
		search: ''
	});

	const onChangeHandler = (e) => {
		const value = e.target.value;
		setSearchState({
			...searchState,
			[e.target.name]: value
		})
		console.log(value)
	}


	const [FeaturedShopData, setFeaturedShopData] = useState([])

	useEffect(() => {
		axios.get('/featured-shops')
			.then((res) => {
				setLoading(true)
				console.log(res.data)
				setFeaturedShopData(res.data)
			})

	}, [])

	const handleShow = () => {
		setShow(true);
	}

	const handleClose = () => setShow(false);



	const modal = (
		<Modal show={show} size={'lg'} id={'service__modal'}>
			<Modal.Header>
				<Modal.Title className={'uppercase white bold'}>Social Media</Modal.Title>
				<Modal.Title style={{ cursor: "pointer" }} className={'uppercase white bold'} onClick={handleClose} >x</Modal.Title>
			</Modal.Header>
			<Modal.Body className={'px-5'}>
				<p>Accept appointments via your Facebook page and Instagram
					profile with a "Book Now" button. Make it easy for people to find your
					business on Google where they can
					immediately book your services,
					Customer information at the time of booking, Create customised admission forms, to collect customer information, during the booking process. You can include text, number, checkbox, dropdown or date responses.</p>
			</Modal.Body>
		</Modal>
	)


	let featuresData = (
		<>
			<FeaturedCarousel
				featuredShops={FeaturedShopData} />
		</>
	)
	if (FeaturedShopData && FeaturedShopData.length === 0) {
		featuresData = (
			<div className={'mt-5'}>
				<p className={'text-center'}>Currently No Shops Available</p>
			</div>
		)
	}

	if (!loading) {
		featuresData = <Loader style={'text-center mt-5'} />
	}
	const [selectedLocation, setSelectedLocation] = useState(null)

	const onPlaceSearch = (val) => {
		setValue(val)
		geocodeByAddress(val.label)
			.then(results => getLatLng(results[0]))
			.then(({ lat, lng }) => {
				console.log('PLACES', lat, lng)
				setSelectedLocation({
					lat,
					lng
				})
			}
			);
	}

	const getCurrentLocation = () => {
		navigator.geolocation.getCurrentPosition(function (position) {
			axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude}, ${position.coords.longitude}&key=${process.env.REACT_APP_GOOGLE_MAP_API}`)
				.then((res) => {
					let obj = {
						label: res.data.results[0].formatted_address,
						value: res.data.results[0],
					}
					console.log(obj)
					setValue(obj)
					setSelectedLocation({
						lat: position.coords.latitude,
						lng: position.coords.longitude
					})
				})

		});
	}

	const [serviceError, setServiceError] = useState(null)

	const onFormSubmit = (e) => {
		e.preventDefault();
		if (searchState.serviceType === '') {
			setServiceError("please select service")
			setError(true)
		} else {
			setSearchState({
				...searchState,
				serviceType: ''
			})
			window.location.href = `/result?shopName=${searchState.search}&shopType=${searchState.serviceType}&latitude=${selectedLocation ? selectedLocation.lat : 0}&longitude=${selectedLocation ? selectedLocation.lng : 0}`
		}
	}
	let errorMsg;
	if(serviceError){
		errorMsg = (
			<p className="text-danger"> {serviceError} </p>
		)

	}
	
	return (
		<div>
			{modal}
			<div id={'section__1'}>
				<Container>
					<Row id={'header__heading'}>
						<Col lg={6} className={'w-100'}>
							<h1 id={'home__heading'}>
								<span>Search </span>
								<span id={'salon'}>For Your salon </span>
								<span>Online :</span>
							</h1>
							<p id={'home__paragraph'}>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
								sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
							</p>
							<Form onSubmit={onFormSubmit} >
								<div className={'w-100'}>
									{errorMsg}
									<Form.Control as={'select'} className={'header__form px-1'} name={'serviceType'} onChange={onChangeHandler}>
										<option selected disabled > Select Service</option>
										{
											services.map((name, index) => (
												<option key={index}>{name}</option>
											))
										}
									</Form.Control>
									<div className="mt-2">
										<GooglePlacesAutocomplete
											autocompletionRequest={{
												bounds: [
													{ lat: 50, lng: 50 },
													{ lat: 100, lng: 100 }
												],
												componentRestrictions: {
													country: ['ae'],
												}
											}}

											apiKey={process.env.REACT_APP_GOOGLE_MAP_API}
											selectProps={{
												placeholder: 'Enter Location',
												value,
												onChange: (val) => onPlaceSearch(val),
											}}
										/>
									</div>
									<Form.Control type="text" name={'search'} onChange={onChangeHandler} placeholder="Search By Shop Name" className={' header__form mt-2'} />

								</div>

								<Button type="button" className="w-100 mt-2 btn btn-primary header__btn" onClick={getCurrentLocation} > Get Current Location </Button>

								<Button type={'submit'} className={'w-100 mt-2 btn btn-primary header__btn'}>Search</Button>
								{/*<NavLink to={`/result?shopName=${searchState.search}&shopType=${searchState.serviceType}&latitude=${selectedLocation ? selectedLocation.lat : 0}&longitude=${selectedLocation ? selectedLocation.lng : 0}`} type="submit" >*/}
								{/*	Search*/}
								{/*</NavLink>*/}
							</Form>
						</Col>
					</Row>
				</Container>
			</div>
			<div id={'section__2'} className={'py-5'}>
				<Container>
					<Row className={'align-items-center'}>
						<Col md={7}>
							<img src={AboutImg} alt={'about__img'} className={'img-fluid'} />
						</Col>
						<Col md={5} className={'text-left mt-5'}>
							<p className={'text-muted'}>WHO WE ARE</p>
							<h1 id={'about'}>About <span className={'medium'}>Us</span></h1>
							<img src={lineImg} alt={'line__img'} />
							<p>Welcome in ThiaZa.

								Our company is growing day by day, it is young but it has been growing at a phenomenal
								rate, to help you grow and develop.
								This means we can offer customers more choice and give them the confidence to
								try new things. We take care of
								beauty and wellness appointments in an easy, quick and intuitive way.
								Today, ThiaZa is the most complete booking platform
								of BEAUTY and WELLNESS services in the Emirates. We are based in Dubai
								but we have 80 employees working across the Emirates, in collaboration
								with over 1500 local partners. ThiaZa was first
								created in France, a small specialized beauty salon under the name of "Les Deux
								Moi Z'elles" which today is one of the best salons in Montpellier.
								The story began in 2018, and since then we have brought together our extensive
								experience in the world of beauty and booking services,
								to bring you the best in your search for aesthetic medicine, aesthetic care
								, hairdresser barber as well as wellness centres in one click! À
								across Dubai. We have created a great concept:
								24/7 booking platform that connects clients and salon managers,
								allowing you to book at any time at prices that suit you, without
								time and without last minute cancellations.
								For our users and partners, we are more than a booking platform, we are the place where everyone can find their happiness no matter where they are located in
								Dubai. We want the best for you.
							</p>
						</Col>
					</Row>
				</Container>
			</div>

			<div id={'section__3'}>
				<Container>
					<Row>
						<Col md={12} className={'text-center'}>
							<p className={'text-muted'}>Discover our professional</p>
							<h1 className={'uppercase'}>Our <span className={'bold'}>Services</span></h1>
							<img src={lineImg} alt={'line__img'} />
						</Col>
					</Row>
				</Container>

				<div className={'d-flex overflow-hidden my-5'}>
					<div className={'wrapper position-relative'}>
						<img alt={'service1'} src={serviceImg1} className={'img'} id={'barber'} />
						<div className={'hover__text py-4 w-100 text-center'}>
							<h3>Beautician</h3>
						</div>
					</div>
					<div className={'wrapper position-relative'}>
						<img alt={'service1'} src={serviceImg2} className={'img'} id={'makeup'} />
						<div className={'hover__text py-4 w-100 text-center'}>
							<h3>Barber</h3>
						</div>
					</div>
					<div className={'wrapper position-relative'}>
						<img alt={'service1'} src={serviceImg3} className={'img'} id={'doctor'} />
						<div className={'hover__text py-4 text-center w-100'}>
							<h3>Aesthetic Doctors</h3>
						</div>
					</div>
					<div className={'wrapper position-relative'}>
						<img alt={'service1'} src={serviceImg4} className={'img'} id={'dentist'} />
						<div className={'hover__text py-4 text-center w-100'}>
							<h3>Dentist</h3>

						</div>
					</div>
					<div className={'wrapper position-relative'}>
						<img alt={'service1'} src={serviceImg5} className={'img'} id={'massage'} />
						<div className={'hover__text py-4 text-center w-100'}>
							<h3>Spa</h3>

						</div>
					</div>
				</div>
			</div>

			<div id="section__4">
				<Container>
					<Row>
						<Col md={12} className={'mt-4 mb-5 pb-5 text-center'}>
							<p className={'text-muted  m-0 p-0'}>Discover</p>
							<h1 className={' m-0 p-0 how'}>How it <span className={'bold'}>works</span></h1>
							<img src={lineImg} alt={'line__img'} className={'pb-5 mb-5'} />
						</Col>
					</Row>
				</Container>
			</div>
			<div id="section__5">
				<Container>
					<Row>
						<Col lg={3}>
							<Card className={'shadow'}>
								<Card.Body className={'text-center'}>
									<img alt={'icon__1'} src={icon4} className={'w-50 mb-4'} />
									<h5 className={'uppercase'}>24/7</h5>
									<img alt={'line__img2'} src={lineImg2} />
									<p className={'text-muted card__paragraph'}>Keep all your booking options open
										24/7 and let your customers book their
										appointment through multiple channels such as your
										booking site, etc.
									</p>
								</Card.Body>
							</Card>
						</Col>
						<Col lg={3}>
							<Card className={'shadow'}>
								<Card.Body className={'text-center'}>
									<img alt={'icon__1'} src={icon1} className={'w-50 mb-4'} />
									<h5 className={'uppercase'}>SCHEDULED APPOINTMENTS</h5>
									<img alt={'line__img2'} src={lineImg2} />
									<p className={'text-muted card__paragraph'}>Send personalised reminders before scheduled
										scheduled appointments. Eliminate last-minute cancellations
										by taking a deposit.
									</p>
								</Card.Body>
							</Card>
						</Col>
						<Col lg={3}>
							<Card className={'shadow'}>
								<Card.Body className={'text-center'}>
									<img alt={'icon__1'} src={icon2} className={'w-50 mb-4'} />
									<h5 className={'uppercase'}>BOOK YOUR APPOINTMENT</h5>
									<img alt={'line__img2'} src={lineImg2} />
									<p className={'text-muted card__paragraph'}>Avoid double bookings by synchronising your personal calendar with your
										your online booking schedule.
									</p>
								</Card.Body>
							</Card>
						</Col>
						<Col lg={3}>
							<Card className={'shadow'}>
								<Card.Body className={'text-center'}>
									<img alt={'icon__1'} src={icon3} className={'w-50 mb-4'} />
									<h5 className={'uppercase'}>Social Media</h5>
									<img alt={'line__img2'} src={lineImg2} />
									<p className={'text-muted card__paragraph'}>Accept appointments via your Facebook page and Instagram
										profile with a "Book Now" button. <span style={{ cursor: "pointer", color: "black" }} onClick={handleShow}>
											Read More..
										</span>
									</p>
								</Card.Body>
							</Card>
						</Col>
					</Row>
				</Container>
			</div>

			<div id="section__6" className={'mb-5 pb-5'}>
				<Container>
					<Row>
						<Col className={'text-center'}>
							<p className={'text-muted m-0 p-0'}>hurry</p>
							<h1 className={'uppercase m-0 p-0'}>They talk <span className={'bold'}>about us</span></h1>
							<img alt={'img__line'} src={lineImg} />
							<img alt={'img__layer'} src={Layer} className={'img-fluid mt-5 pt-5'} />
						</Col>
					</Row>
				</Container>
			</div>

			<div id={'section__7'}>
				<Container>
					<Row>
						<Col xs={12} className={'text-center'}>
							<h1 ><span className={'bold'}>Are you a beauty professional? </span>Find out how to book an appointment online!</h1>
							<NavLink to={'/vendor/register'}><Button className={'site__btn px-4 py-2'}>ADD YOUR ESTABLISHMENT</Button></NavLink>
						</Col>
					</Row>
				</Container>
			</div>
			<div id={'section__8'}>
				<Container>
					<Row>
						<Col className={'text-center'}>
							<h1>FEATURED <span className={'bold'}>SHOPS</span></h1>
							<img alt={'img__line'} src={lineImg} />
						</Col>
					</Row>
					{
						featuresData
					}
				</Container>
			</div>
			<div id={'section__9'} className={'my-5'}>
				<Container fluid>
					<Row>
						<Col xl={4} sm={12} className={'text-center'}>
							<p className={'uppercase text-muted p-0 m-0'}>in 2 years</p>
							<h1 className={'bold how'}><span className={'medium'}>strong</span> growth</h1>
						</Col>
						<Col xl={8} sm={12} className={'text-center'} >
							<Row className={'w-100'} >
								<Col lg={4} sm={4}>
									<h1 className={'white'}>10,000<span className={'site__color mx-2'}>+</span></h1>
									<p className={'sec9__paragraph'}>Trade Fair & Institute</p>
								</Col>
								<Col lg={4} sm={4} className={'text-center'}>
									<h1 className={'white'}><span className={'site__color mx-2'}>1</span>Appointment</h1>
									<p className={'sec9__paragraph'}>Taken Every Second</p>
								</Col>
								<Col lg={4} sm={4} className={'text-center'}>
									<h1 className={'white'}><span className={'site__color mx-2'}>1</span>Billion</h1>
									<p className={'sec9__paragraph'}>Appointment Sold</p>
								</Col>
							</Row>
						</Col>
					</Row>
				</Container>
			</div>
			<div id={'section__10'}>
				<Container>
					<Row>
						<Col className={'text-center'}>
							<p className={'text-muted uppercase m-0 p-0'}>check out for</p>
							<h1 className={'p-0 m-0'}>FREQUENTLY <span className={'bold'}>ASKED QUESTIONS</span></h1>
							<img alt={'img__line'} src={lineImg} />
							<div>
								<Accordion className={'text-left'} flush>
									<Accordion.Item eventKey="0">
										<Accordion.Header className={'accord text-muted'}>What is Thiaza ?</Accordion.Header>
										<Accordion.Body>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
											tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
											veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
											commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
											velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
											cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
											est laborum.
										</Accordion.Body>
									</Accordion.Item>
									<Accordion.Item eventKey="1">
										<Accordion.Header>How to make an appointment on Thiaza?</Accordion.Header>
										<Accordion.Body>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
											tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
											veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
											commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
											velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
											cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
											est laborum.
										</Accordion.Body>
									</Accordion.Item>
									<Accordion.Item eventKey="2">
										<Accordion.Header>Do I have to pay online on Thiaza ?</Accordion.Header>
										<Accordion.Body>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
											tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
											veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
											commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
											velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
											cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
											est laborum.
										</Accordion.Body>
									</Accordion.Item>
									<Accordion.Item eventKey="3">
										<Accordion.Header>How do I make my salon or institute appear on Thiaza?</Accordion.Header>
										<Accordion.Body>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
											tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
											veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
											commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
											velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
											cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
											est laborum.
										</Accordion.Body>
									</Accordion.Item>
								</Accordion>
							</div>
						</Col>
					</Row>
				</Container>
			</div>
		</div>
	);
};

export default Home;
