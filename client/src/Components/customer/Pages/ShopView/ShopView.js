import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Container, Modal, ModalBody, Row, Form } from "react-bootstrap";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { Link } from "react-scroll";
import Dropdown from 'react-dropdown';
import styled from "styled-components";
import * as actions from '../../../../Store/customer/actions/index';
import Carousel from "../../../../lib/customer/Carousel/Carousel";
import RatingStar from "../../../../lib/customer/RatingStar/RatingStar";
import {Map, GoogleApiWrapper, Marker} from "google-maps-react";
import { getFormattedTime } from "../../../../Helpers/vendorHelpers";
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Scrollbars } from 'react-custom-scrollbars';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import './ShopView.css'
import axios from "axios";
import Loader from "../../../../lib/customer/Loader/Loader";




const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	formControl: {
		marginLeft: '50px',
		marginBottom: '10px'
	},

}));

const ShopView = props => {
	
	const storeId = props.match.params.id;
	let cart;
	if (JSON.parse(localStorage.getItem('cart'))) {
		cart = JSON.parse(localStorage.getItem('cart'))

	} else {
		cart = props.cart;
	}
	const [category, setCategory] = useState(null);
	const [allServices, setAllServices] = useState(null)
	const [service, setService] = useState({})
	const [reviews, setReviews] = useState(null);


	useEffect(() => {
		props.getShop(storeId);
		axios.get(`/shop-services/${storeId}`)
			.then((res) => {
				setAllServices(res.data.services)
			})
		axios.get('/shop-categories/' + storeId)
			.then((res) => {
				console.log(res.data)
				setCategory(res.data)
			})
		axios.get('/reviews/' + storeId)
			.then((res) => {
				setReviews(res.data.reviews);
			})
		window.scrollTo(0, 0)
	}, []);

	const Wrapper = styled.div`
      background-image: url(${props => props.img});
      background-size: cover;
      background-repeat: no-repeat;
      padding: 12rem 0;
	`;
	//TO open service modal
	const [basket, setBasket] = useState(false)

	//modal show
	const [show, setShow] = useState(false);


	const handleClose = () => setShow(false);
	const handleShow = (service) => {
		setShow(true);
		setService(service);
	}

	const onAddHandler = (service) => {
		setBasket(true);
		props.addToCart(service);
	}

	const onRemoveHandler = (serviceId, servicePrice) => {
		if (props.cart.length <= 1) {
			setBasket(false);
		}
		props.removeFromCart(serviceId, servicePrice);
	}

	const selectStatus = (service) => {
		if (cart.length > 0) {
			const cartItemFound = cart.find(cartItem => service._id === cartItem._id)
			if (cartItemFound) {
				return (
					<Button className={'uppercase service__btn_2'} onClick={() => onRemoveHandler(service._id, service.price)}>Selected</Button>
				)
			} else {
				return (
					<Button className={'uppercase service__btn'} onClick={() => onAddHandler(service)}>Select</Button>
				)
			}
		}

		return (
			<Button className={'uppercase service__btn'} onClick={() => onAddHandler(service)}>Select</Button>
		)

	}

	let services;

	if (!allServices) {
		services = (
			<Loader />
		)
	}


	if (allServices && allServices.length === 0) {
		services = (
			<div className={'text-center'}>
				<p> No Service Found </p>
			</div>
		)
	}

	if (allServices && allServices.length > 0) {
		services = allServices.map((service, index) => (
			<Col key={index} md={6}>
				<Card className={'shadow-lg mb-3'}>
					<Card.Body className={'text-left'}>
						<div className={'d-flex justify-content-between'}>
							<p className={'bold'}>{service.serviceName}</p>
							<p className={'medium uppercase'}>Aed {service.price}</p>
						</div>
						<p className={'text-muted'}>{getFormattedTime(service.duration)}</p>
						<div className={'d-flex'}>
						</div>
						<div className={'d-flex justify-content-between'}>
							<Button className={'uppercase service__btn'} onClick={() => handleShow(service)}>show details</Button>
							{selectStatus(service)}
						</div>
					</Card.Body>
				</Card>
			</Col>
		))
	}

	const classes = useStyles();
	const [value, setValue] = React.useState('5');

	const handleradio = (event) => {
		setReviews(null)
		setValue(event.target.value);
		const params = { rating: event.target.value };

		axios.get('/reviews-rated/' + storeId, {
			params
		}).then((res) => {
			setReviews(res.data)
		})

	};

	let review = (
		<div className={'mx-auto mt-5'}>
			<Loader style={'text-left'}/>
		</div>
	)

	if (reviews && reviews.length === 0) {
		review = (
			<div className={'mx-auto mt-5'}>
				<p className={'text-left'}> No Reviews Found </p>
			</div>
		);
	}



	if (reviews && reviews.length > 0) {
		review = (
			<>
				<div className="col-lg-8 mt-5">
					<Scrollbars style={{ width: 850, height: 400 }}>
						{
							reviews.map((review) => {
								const date = new Date(review.createdAt)
								const new_Date = new Date().getHours();
								console.log(`${date.getDate()}-${date.getMonth()}`)
								return (
									<>
										<div>
											<p><RatingStar size="25" value={review.rating} /></p>
											<p>{review.comment}</p>
											<p className={'text-muted'}> {review.customerName}  • <span className={'text-muted'}>  {`${new_Date - date.getHours()} Hours ago`} </span> </p>
										</div>
										<hr />
									</>
								)
							})
						}
					</Scrollbars>

				</div>

			</>
		)
	}




	const modal = (
		<Modal show={show} size={'lg'} onHide={handleClose} id={'service__modal'}>
			<Modal.Header>
				<Modal.Title className={'uppercase white bold'}>Service Details</Modal.Title>
			</Modal.Header>
			<ModalBody className={'px-5'}>
				<h4 className={'text-center'}>{service.name}</h4>
				<Row className={'mt-4'}>
					<Col>
						<h4>Service Description</h4>
						<p className={'text-left light'}>
							{service.description}
						</p>
					</Col>
				</Row>
			</ModalBody>
		</Modal>
	)

	const checkoutBasket = (
		<Container id={'checkout__modal'} className={basket ? 'open' : 'close'}>
			<Row>
				<Col md={12}>
					<Card className={'pl-3'}>
						<Row>
							<Col sm={8} xs={12} className={'basket px-4 pt-3'}>
								<h6 className={'uppercase text-muted'}>Basket</h6>
								<h2 className={'medium uppercase'}>{props.cart.length} services<span id={'price'} className={'px-3 bold'}>Aed {props.totalPrice}</span></h2>
							</Col>
							<Col sm={4} xs={12} className={'time'}>
								<NavLink to={'/appointment/' + storeId} className={'btn btn-primary'} id={'choose__time'}>Choose Time</NavLink>
							</Col>
						</Row>
					</Card>
				</Col>
			</Row>
		</Container>
	)
	let schedule = <Loader />
	if (props.shop.schedule) {
		schedule = (
			<ul className={'list-unstyled'}>
				<li className={'uppercase text-muted'}>- Mon ({props.shop.schedule.monday})</li>
				<li className={'uppercase text-muted pt-3'}>- Tue ({props.shop.schedule.tuesday})</li>
				<li className={'uppercase text-muted pt-3'}>- Wed ({props.shop.schedule.wednesday} )</li>
				<li className={'uppercase text-muted pt-3'}>- Thur ({props.shop.schedule.thursday} )</li>
				<li className={'uppercase text-muted pt-3'}>- Fri ({props.shop.schedule.friday} )</li>
				<li className={'uppercase text-muted pt-3'}>- Sat ({props.shop.schedule.saturday})</li>
				<li className={'uppercase text-muted pt-3'}>- Sun ({props.shop.schedule.sunday})</li>
			</ul>
		)
	}
	let carousel;
	if (props.shop && props.shop.gallery) {
		carousel = <Carousel images={props.shop.gallery} />
	}
	let shop = (
		<div style={{ height: '100vh' }} className={'d-flex align-items-center justify-content-center'}>
			<Loader style={'text-center mt-5'} />
		</div>
	)

	const options = [];
	if (category && category.length > 0) {
		category.forEach((category) => {
			options.push({
				value: category,
				label: category
			})
		})
	}
	const onCategoryChange = (val) => {
		setAllServices(null)
		const category = `category=${val.value}`
		axios.get(`/shop-services/${storeId}?${category}`)
			.then((res) => {
				setAllServices(res.data.services)
			})
	}

	if (!props.loading && props.shop && props.shop.shopBannerImage) {
		shop = (
			<>
				{modal}
				<Wrapper img={props.shop.shopBannerImage.avatar} className="mobile-pic-height-shopview">
					<Container>
						<Row className={'justify-content-center'}>
							<Col md={8} className={'shop_head text-center'}>
								<h1 className={'uppercase bold white'}>{props.shop.shopName}</h1>
								<p className={'white medium'}> {props.shop.schedule.friday} </p>
								<div className={'d-flex justify-content-center align-items-center'}>
									<RatingStar
										value={props.shop.avgRating}
									/>
									<p className={'white my-0 mx-2 p-0'}>({props.shop.reviews.length} Reviews)</p>
								</div>
								<div className={'d-flex justify-content-center white mt-3'}>
									<i className="fas fa-map-marker-alt pr-2" style={{ fontSize: '20px' }} />
									<h4>{props.shop.address}</h4>
								</div>
							</Col>
						</Row>
					</Container>
				</Wrapper>

				<Container id={'card_container'}>
					<Row className={'justify-content-center'}>
						<Col md={8.5} className={'button-to-hide-shopview'}>
							<Card>
								<Card.Body>
									<Link activeClass="active"
									      to="about__section"
									      spy={true}
									      smooth={true}
									      hashSpy={true}
									      offset={50}
									      duration={500}
									      delay={10}
									      isDynamic={true}
									      ignoreCancelEvents={false}
									>
										<Button className={'service__btn uppercase mx-2 mt-1'} size={'lg'} data={'about__section'}>About Us</Button>
									</Link>

									<Link activeClass="active"
									      to="service__section"
									      spy={true}
									      smooth={true}
									      hashSpy={true}
									      offset={50}
									      duration={500}
									      delay={10}
									      isDynamic={true}
									      ignoreCancelEvents={false}
									>
										<Button className={'service__btn uppercase mx-2 mt-1'} size={'lg'}>Our service</Button>
									</Link>

									<Link activeClass="active"
									      to="gallery__section"
									      spy={true}
									      smooth={true}
									      hashSpy={true}
									      offset={50}
									      duration={500}
									      delay={10}
									      isDynamic={true}
									      ignoreCancelEvents={false}
									>
										<Button className={'service__btn uppercase mx-2 mt-1'} size={'lg'}>image gallery</Button>
									</Link>

									<Link activeClass="active"
									      to="review__section"
									      spy={true}
									      smooth={true}
									      hashSpy={true}
									      offset={50}
									      duration={500}
									      delay={10}
									      isDynamic={true}
									      ignoreCancelEvents={false}
									>
										<Button className={'service__btn uppercase mx-2 mt-1'} size={'lg'}>reviews</Button>
									</Link>

									<Link activeClass="active"
									      to="service__section"
									      spy={true}
									      smooth={true}
									      hashSpy={true}
									      offset={50}
									      duration={500}
									      delay={10}
									      isDynamic={true}
									      ignoreCancelEvents={false}
									>
										<Button className={'service__btn uppercase mx-2 mt-1'} size={'lg'}>Book Appointment now</Button>
									</Link>
								</Card.Body>
							</Card>
						</Col>
					</Row>


					<div id={'service__section'}>
						<Row className={'mt-5 justify-content-between'}>
							<Col sm={6} className={'text-left'}>
								<h4 className={'uppercase bold'}>Services</h4>
							</Col>
							<Col sm={3} className={'text-center'}>
								<Dropdown options={options} onChange={onCategoryChange} placeholder={'Select Category'} />
							</Col>
						</Row>

						<Row className={'mb-5 pt-5 mt-5 justify-content-center'}>
							{
								services
							}
						</Row>
					</div>

					<div id={'gallery__section'}>
						<Row className={'text-left mb-5'}>
							<Col md={12}>
								<h4 className={'uppercase bold'}>Gallery</h4>
								{
									carousel
								}
							</Col>
						</Row>
					</div>
					<div id={'review__section'}>
						<div className="row justify-content-between my-5">
							<div className="col-lg-4">
								<div className={'filter'}>
									<p className={' pt-3 text-muted text-center'}>Filter by rating</p>
									<div className={classes.root}>
										<FormControl component="fieldset" className={classes.formControl}>
											<RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleradio}>
												<FormControlLabel style={{ color: "orange" }} value="5" control={<Radio />} label={<span className={'d-flex'}> <RatingStar size="30" value="5" /> </span>} />
												<FormControlLabel style={{ color: "orange" }} value="4" control={<Radio />} label={<span className={'d-flex'}> <RatingStar size="30" value="4" /></span>} />
												<FormControlLabel style={{ color: "orange" }} value="3" control={<Radio />} label={<span className={'d-flex'}> <RatingStar size="30" value="3" /> </span>} />
												<FormControlLabel style={{ color: "orange" }} value="2" control={<Radio />} label={<span className={'d-flex'}> <RatingStar size="30" value="2" /> </span>} />
												<FormControlLabel style={{ color: "orange" }} value="1" control={<Radio />} label={<span className={'d-flex'}> <RatingStar size="30" value="1" /></span>} />
											</RadioGroup>
										</FormControl>
									</div>
								</div>
							</div>
							{
								review
							}
						</div>
					</div>

					<div id={'about__section mt-4'}>
						<Row>
							<Col sm={12} className={'text-left'}>
								<h4 className={'uppercase bold'}>About us</h4>
							</Col>
						</Row>
						<Row className={''}>
							<Col lg={8}>
								<p className={'text-left light'}>
									<td dangerouslySetInnerHTML={{ __html: props.shop.description }} />
								</p>
							</Col>
						</Row>
					</div>
					<div id={'about__section mt-4'}>
						<Row>
							<Col sm={12} className={'text-left'}>
								<h4 className={'uppercase bold'}>Our Location</h4>
							</Col>
						</Row>
						<Row>
							<Col md={12} style={{height: '400px'}}>
								<Map google={props.google}
								     className={"map-responsive-shop"}
								initialCenter={{
									lat: props.shop.location.coordinates[0],
									lng: props.shop.location.coordinates[1],
								}}
								zoom={14}
								>
								<Marker
									position={{
										lat: props.shop.location.coordinates[0],
										lng: props.shop.location.coordinates[1],
									}}
									name={'Your position'} />

							</Map>
							</Col>
						</Row>
					</div>
					<div id={'about__section '}>
						<Row>
							<Col sm={12} className={'text-left'}>
								<h4 className={'uppercase bold'}>Timings</h4>
							</Col>
						</Row>
						<Row className={''}>
							<Col lg={4} className={'text-left'}>
								{
									schedule
								}
							</Col>
						</Row>
					</div>
				</Container>
				<div id={'wrapper_checkout'}>
					{checkoutBasket}
				</div>
			</>
		)
	}

	return (
		shop
	)
};

const mapStateToProps = state => ({
	shop: state.shop.shop,
	cart: state.cart.cart,
	totalPrice: state.cart.totalPrice,
	loading: state.shop.loading,
})

const mapDispatchToProps = dispatch => ({
	getShop: (storeId) => dispatch(actions.fetchShop(storeId)),
	addToCart: (service) => dispatch(actions.addToCart(service)),
	removeFromCart: (serviceId, servicePrice) => dispatch(actions.removeFromCart(serviceId, servicePrice))
})

export default connect(mapStateToProps, mapDispatchToProps)(GoogleApiWrapper({
	apiKey: process.env.REACT_APP_GOOGLE_MAP_API
})(ShopView))
