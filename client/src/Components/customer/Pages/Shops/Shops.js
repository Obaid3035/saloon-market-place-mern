import React, { useState, useEffect } from 'react';
import { Button, Col, Container, Form, Row, Card, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import Shop from "./Shop/Shop";
import { fetchShops } from "../../../../Store/customer/actions/index";
import './Shops.css'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RatingStar from 'lib/customer/RatingStar/RatingStar';
import Slider from '@material-ui/core/Slider';
import Loader from "../../../../lib/customer/Loader/Loader";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";
import InfoWindowEx from "../../../../lib/customer/InfoWindow/InfoWindow";


const Shops = props => {
	const [show, setShow] = useState(false);
	const [value, setValue] = React.useState([20, 37]);
	const [radioValue, setRadioValue] = useState("5");
	const [hideButton, setHideButton] = useState(true);
	const [selectedLocation, setSelectedLocation] = useState(null);
	const [marker, setMarker] = useState({});
	const [infoShow, setInfoShow] = useState(false);
	const [selectedShop, setSelectedShop] = useState(null);

	const shopNameQueryString = new URLSearchParams(props.location.search).get('shopName')
	const shopTypeQueryString = new URLSearchParams(props.location.search).get('shopType')
	const latitudeQueryString = new URLSearchParams(props.location.search).get('latitude')
	const longitudeQueryString = new URLSearchParams(props.location.search).get('longitude')

	useEffect(() => {
		console.log(latitudeQueryString, longitudeQueryString)
		if (parseInt(latitudeQueryString) === 0 && parseInt(longitudeQueryString) === 0) {
			props.getAllStore(shopNameQueryString, shopTypeQueryString, '', parseInt(latitudeQueryString), parseInt(longitudeQueryString));

			setSelectedLocation({
				lat: parseInt(latitudeQueryString),
				lng: parseInt(longitudeQueryString)
			})
		} else {
			props.getAllStore(shopNameQueryString, shopTypeQueryString, '', latitudeQueryString, longitudeQueryString);

			setSelectedLocation({
				lat: latitudeQueryString,
				lng: longitudeQueryString
			})
		}

		console.log(shopNameQueryString, shopTypeQueryString);
		window.scrollTo(0, 0)
	}, []);


	let shops = (
		<Loader style={'text-center mt-5'} />
	)

	console.log(props.shops)

	if (props.shops && props.shops.length === 0) {
		shops = (
			<div  style={{ height: '100vh' }} className={'text-center'}>
				<p>No Shop Found</p>
			</div>
		)
	}

	if (props.shops && props.shops.length > 0) {
		console.log(props)

		shops = props.shops.map((shop, index) => {

			const mainShop = {
				avgRating: shop.avgRating,
				address: shop.address,
				shopImage: shop.shopImage.avatar,
				shopName: shop.shopName,
				_id: shop._id
			}
			return (
				(
					<Shop key={index} shop={mainShop} />
				)
			)
		});

	}

	const handleFilterSubmit = (e) => {
		e.preventDefault()
		props.getAllStore(shopNameQueryString, shopTypeQueryString, radioValue, latitudeQueryString, longitudeQueryString);

		setShow(false);
	}

	const handleShow = () => {
		setShow(true);
	}

	const handleChange = (event, newValue) => {
		setValue(newValue);

	};

	const handleCloseModal = () => {
		setShow(false);
	}

	const onMarkerClick = (props, marker, shop) => {
		setSelectedShop(shop)
		setMarker(marker)
		setInfoShow(true);
	}


	const modal = (
		<Modal show={show} size={'md'} id={'filter-modal'} animation={false} className="shadow animate__animated animate__bounceIn animate__delay-0.5s">
			<Modal.Body className="modal-filter-body">
				<form onSubmit={handleFilterSubmit}>
					<div className="row">
						<div className="d-flex justify-content-between align-items-center mb-3" style={{ width: "91%" }}>
							<Modal.Title className="ml-3">Sort by</Modal.Title>
							<Modal.Title onClick={handleCloseModal} style={{ cursor: "pointer" }}>X</Modal.Title>
						</div>
						<div className="col-md-12">
							<RadioGroup aria-label="gender" name="gender1" value={radioValue} onChange={(e) => setRadioValue(e.target.value)}>
								<div className="d-flex justify-content-between align-items-center">
									<div><RatingStar size="30" value="5" /></div>
									<FormControlLabel value="5" control={<Radio />} />
								</div>
								<div className="d-flex justify-content-between align-items-center">
									<div><RatingStar size="30" value="4" /></div>
									<FormControlLabel value="4" control={<Radio />} />
								</div>
								<div className="d-flex justify-content-between align-items-center">
									<div><RatingStar size="30" value="3" /></div>
									<FormControlLabel value="3" control={<Radio />} />
								</div>
								<div className="d-flex justify-content-between align-items-center">
									<div><RatingStar size="30" value="2" /></div>
									<FormControlLabel value="2" control={<Radio />} />
								</div>
								<div className="d-flex justify-content-between align-items-center">
									<div><RatingStar size="30" value="1" /></div>
									<FormControlLabel value="1" control={<Radio />} />
								</div>
								{/*<hr className="w-100" />*/}
								{/*<h3 className="">Price</h3>*/}
								{/*<Slider*/}
								{/*	value={value}*/}
								{/*	onChange={handleChange}*/}
								{/*/>*/}
								{/*<div className="d-flex justify-content-between">*/}
								{/*	<p>{(13500 * value[0]) / 100}</p>*/}
								{/*	<p>{(13500 * value[1]) / 100}</p>*/}
								{/*</div>*/}
								<div className="text-center">
									<Button type="submit">Search</Button>
								</div>
							</RadioGroup>
						</div>
					</div>
				</form>
			</Modal.Body>
		</Modal>
	)
	


	let hideShowBtn;

	if (hideButton) {
		hideShowBtn = (<Button onClick={() => setHideButton(false)} className={'uppercase search__btn hide-map-on-mobile'} id={'hide__btn'}>Hide Map</Button>);
	}
	else {
		hideShowBtn = (<Button onClick={() => setHideButton(true)} className={'uppercase search__btn hide-map-on-mobile'} id={'hide__btn'}>Show Map</Button>);
	}

	let mainMapHide;

	if (hideButton) {
		mainMapHide = "inline";
	}
	else {
		mainMapHide = "none";
	}

	let makeShopTwelve;

	if (hideButton) {
		makeShopTwelve = 6;
	}
	else {
		makeShopTwelve = 8;
	}

	const onInfoWindowClose = () => {
		setMarker(null);
		setInfoShow(false)
	};


	return (
		<div>
			<div id={'section__result__2'} className={'mt-5 mb-5'}>
				<Container>
					<Row>
						<Col md={6}>
							<p className={'text-muted'}>Choose from {props.shops ? props.shops.length : 0} venues offering hairdresser and salons in edinburgh</p>
						</Col>
						{modal}
						<Col md={6} className={'d-flex flex-row-reverse text-right mb-4'}>
							{hideShowBtn}
							<Button className={'uppercase mx-3 search__btn'} id={'filter__btn'} onClick={() => handleShow()}>
								Filter and sort<i className="fas fa-bars pl-2" />
							</Button>
						</Col>
					</Row>
					<Row>
						<Col md={makeShopTwelve} className="mx-auto">
							{
								shops
							}
						</Col>
						<Col md={6} style={{ display: mainMapHide }}>
							{
								selectedLocation ?
									<div className={"w-100  hide-map-on-mobile"}>
										<Map google={props.google}
											initialCenter={selectedLocation}

											zoom={14}
										>
											{
												props.shops ?
													props.shops.map((shop) => (
														<Marker
															onClick={(props, marker) => onMarkerClick(props, marker, shop)}
															position={{
																lat: shop.location.coordinates[0],
																lng: shop.location.coordinates[1]
															}}
															name={'Your position'} />
													))

													: null
											}
											<Marker
												icon={{
													url: 'data:image/svg+xml;base64,PHN2ZyBiYXNlUHJvZmlsZT0iZnVsbCIgd2lkdGg9Ijg2IiBoZWlnaHQ9Ijg2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogICAgPGRlZnM+CiAgICAgICAgPGZpbHRlciBpZD0iYSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KICAgICAgICAgICAgPGZlRHJvcFNoYWRvdyBkeD0iMCIgZHk9Ii41IiBzdGREZXZpYXRpb249Ii45IiBmbG9vZC1jb2xvcj0iIzkzOTM5OCIvPgogICAgICAgIDwvZmlsdGVyPgogICAgPC9kZWZzPgogICAgPGNpcmNsZSBjeD0iNDMiIGN5PSI0MyIgcj0iOCIgZmlsbD0iIzk0YzdmZiI+CiAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iciIgZnJvbT0iMTEiIHRvPSI0MCIgZHVyPSIycyIgYmVnaW49IjBzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIvPgogICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIGZyb209IjEiIHRvPSIwIiBkdXI9IjJzIiBiZWdpbj0iMHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+CiAgICA8L2NpcmNsZT4KICAgIDxjaXJjbGUgY3g9IjQzIiBjeT0iNDMiIHI9IjgiIGZpbGw9IiNmZmYiIGZpbHRlcj0idXJsKCNhKSIvPgogICAgPGNpcmNsZSBjeD0iNDMiIGN5PSI0MyIgcj0iNSIgZmlsbD0iIzAxN2FmZiI+CiAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iciIgdmFsdWVzPSI1OzYuNTs1IiBiZWdpbj0iMHMiIGR1cj0iNC41cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz4KICAgIDwvY2lyY2xlPgo8L3N2Zz4K',
												}}
												position={
													selectedLocation
												}
												name={'Your position'} />
											{
												selectedShop ?
													<InfoWindowEx
														marker={marker}
														onClose={onInfoWindowClose}
														visible={infoShow}
														options={{ maxWidth: 200, maxHeight: 500 }}
													>
														<div>
															<img alt={'shop'}
																src={selectedShop.shopImage.avatar}
																className={'img-fluid w-100'}
															/>
															<p className={'bold p-0 m-0'} style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/service/' + selectedShop._id}>{selectedShop.shopName}</p>
															{
																selectedShop.avgRating > 0 ?
																	[...Array(selectedShop.avgRating)].map(() => (
																		<i className="zmdi zmdi-star p-0 m-0" />
																	))
																	: <p style={{ fontSize: '10px' }}>No Rating Found</p>
															}
														</div>
													</InfoWindowEx>
													: null
											}
										</Map>
									</div> : null
							}
						</Col>
					</Row>
				</Container>
			</div>
		</div>
	);
};



const mapStateToProps = state => {
	return {
		shops: state.shop.shops,
		loading: state.shop.loading
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getAllStore: (shopName, shopType, rating, latitudeQueryString, longitudeQueryString) => dispatch(fetchShops(shopName, shopType, rating, latitudeQueryString, longitudeQueryString))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(GoogleApiWrapper({
	apiKey: process.env.REACT_APP_GOOGLE_MAP_API
})(Shops));
