import React, { useEffect, useState } from 'react';
import './Setting.css'
import { Card, Col, Form, Row } from "react-bootstrap";
import axios from "axios";
import { FormGroup } from "reactstrap";
import Switch from "@material-ui/core/Switch";
import ReactQuill from 'react-quill';
import GooglePlacesAutocomplete, { getLatLng, geocodeByAddress } from 'react-google-places-autocomplete';
import { GoogleApiWrapper, Map, Marker } from 'google-maps-react';
import 'react-quill/dist/quill.snow.css';
import Loader from "../../../../lib/customer/Loader/Loader";

const Setting = props => {
	const [value, setValue] = useState(null);
	const [shop, setShop] = useState(null);
	const [pageLoader, setPageLoader] = useState(false);
	const token = localStorage.getItem('vendorToken');
	const [selectedLocation, setSelectedLocation] = useState(null)
	const [markerLocation, setMarkerLocation] = useState(null);

	const onPlaceSearch = (val) => {
		setSelectedLocation(null)
		setValue(val);
		geocodeByAddress(val.label)
			.then(results => getLatLng(results[0]))
			.then(({ lat, lng }) => {
				console.log('PLACES', lat, lng)
				setSelectedLocation({
					lat,
					lng
				})
				setMarkerLocation({
					lat,
					lng
				})
			}
			);
	}

	useEffect(() => {
		axios.get('/vendor/shop', { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				setShop(res.data);
				setSelectedLocation({
					lat: res.data.location.coordinates[0],
					lng: res.data.location.coordinates[1]
				})
				console.log(res.data);
			});
	}, [])

	const onSubmit = (e) => {
		e.preventDefault();
		setPageLoader(true);
		const formData = {
			shopName: shop.shopName,
			description: shop.description,
			address: shop.address,
			location: JSON.stringify(selectedLocation),
			shopVisibility: shop.shopVisibility,
			schedule: JSON.stringify(shop.schedule),
		}
		axios.put('/vendor/shop', formData, { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				console.log(res.data);
				setPageLoader(false)
				window.location.reload();
			})
	};

	const onChangeHandler = (e) => {
		const value = e.target.value;
		setShop({
			...shop,
			[e.target.name]: value
		})

		console.log({ [e.target.name]: value })
	}

	const onDayChangeHandler = (e) => {
		const value = e.target.value;
		setShop({
			...shop,
			schedule: {
				...shop.schedule,
				[e.target.name]: value
			}
		})

		console.log({ [e.target.name]: value })
	}


	let progressBar = (
		<div className={'progress__bar'}>
			<Loader />
		</div>
	)

	const modules = {
		toolbar: [
			[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
			[{ 'font': [] }],
			['bold', 'italic', 'underline', 'strike', 'blockquote'],
			[{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
			['link', 'image'],
			['clean'],
			[{ 'align': [] }],
			['code-block']
		],
	};

	const formats = [
		'header',
		'font',
		'bold', 'italic', 'underline', 'strike', 'blockquote',
		'list', 'bullet', 'indent',
		'link', 'image', 'align',
		'code-block'
	];

	const editorChangeHandler = (val) => {
		console.log(val)
		setShop({
			...shop,
			description: val
		})
	}

	const getCurrentLocation = () => {
		setSelectedLocation(null)
		navigator.geolocation.getCurrentPosition(function (position) {
			setSelectedLocation({
				lat: position.coords.latitude,
				lng: position.coords.longitude
			})
			setMarkerLocation({
				lat: position.coords.latitude,
				lng: position.coords.longitude
			})
		});
	}

	const onMapClickHandler = (t, map, coord) => {
		setSelectedLocation(null)
		const { latLng } = coord;
		const lat = latLng.lat();
		const lng = latLng.lng();
		setSelectedLocation({
			lat,
			lng
		})
		setMarkerLocation({
			lat,
			lng
		})
	}

	const onMarkLocation = (marker) => {
		setSelectedLocation(null);
		setSelectedLocation({
			lat: marker.position.lat,
			lng: marker.position.lng
		})
		console.log(selectedLocation)
	}


	return (
		<div id="settings" className={'p-5'}>
			<h3 className={'text-center'}>Your Shop</h3>
			<Row className={'justify-content-center h-100'}>
				<Col md={8}>
					{
						shop ?
							<Form onSubmit={onSubmit}>
								<Card>
									<Card.Body>
										<Form.Group>
											<Form.Label> Shop Name </Form.Label>
											<Form.Control type={'text'} name="shopName" value={shop.shopName} onChange={onChangeHandler} required />
										</Form.Group>
										<Form.Group className={'py-3'}>
											<Form.Label> Shop Description </Form.Label>
											<ReactQuill name="description" onChange={editorChangeHandler} value={shop.description} modules={modules} formats={formats} placeholder="Enter Your Message.." />

										</Form.Group>

										<Form.Group className={'py-3'}>
											<Form.Label> Shop Address </Form.Label>
											<Form.Control type={'text'} required name="address" value={shop.address} onChange={onChangeHandler} />
										</Form.Group>
										{
											shop.shopStatus === 'ACTIVE' || shop.shopStatus === 'FEATURED' ?
												(
													<FormGroup>
														<Form.Label for="name">Shop Visibility</Form.Label>
														<Switch
															checked={shop.shopVisibility}
															onChange={(e) => setShop({
																...shop,
																shopVisibility: e.target.checked
															})}
															name={'visible'}
															color={'primary'}
														/>
													</FormGroup>
												) : null
										}
									</Card.Body>
								</Card>

								<Card className={'my-4'}>
									<p className={'text-center'}> Shop Address </p>
									<Row className={'align-items-center justify-content-center mt-4'}>
										<Col sm={8}>
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
										</Col>
										<Col sm={1} className={'mt-1'}>
											<i className="zmdi zmdi-gps-dot cur__location" onClick={getCurrentLocation} />
										</Col>
									</Row>


									{
										selectedLocation ?
											<div className={'mb-4'} style={{ height: '400px' }}>
												<Map google={props.google}
													initialCenter={selectedLocation}
													zoom={14}
													onClick={onMapClickHandler}
												>
													<Marker position={markerLocation}
														name={'Your position'} />
												</Map>
											</div>
											: (
												<div className={'text-center mt-3'}>
													<p>Please Enter Location First</p>
												</div>)
									}
								</Card>

								<Card className={'my-4'}>
									<Card.Body>
										<p className={'text-center'}>Opening Hour -- Closing Hour</p>
										{
											shop.schedule ?
												<Form.Group className={'py-3'}>
													<Form.Label className={'d-block'}> Monday </Form.Label>
													<Form.Control type={'text'} required value={shop.schedule.monday} name={'monday'} onChange={onDayChangeHandler} />

													<Form.Label className={'d-block'}> Tuesday </Form.Label>
													<Form.Control type={'text'} required value={shop.schedule.tuesday} name={'tuesday'} onChange={onDayChangeHandler} />

													<Form.Label className={'d-block'}> Wednesday </Form.Label>
													<Form.Control type={'text'} required value={shop.schedule.wednesday} name={'wednesday'} onChange={onDayChangeHandler} />

													<Form.Label className={'d-block'}> Thursday </Form.Label>
													<Form.Control type={'text'} required value={shop.schedule.thursday} name={'thursday'} onChange={onDayChangeHandler} />

													<Form.Label className={'d-block'}> Friday </Form.Label>
													<Form.Control type={'text'} required value={shop.schedule.friday} name={'friday'} onChange={onDayChangeHandler} />

													<Form.Label className={'d-block'}> Saturday </Form.Label>
													<Form.Control type={'text'} required value={shop.schedule.saturday} name={'saturday'} onChange={onDayChangeHandler} />

													<Form.Label className={'d-block'}> Sunday </Form.Label>
													<Form.Control type={'text'} required value={shop.schedule.sunday} name={'sunday'} onChange={onDayChangeHandler} />
												</Form.Group>
												: null
										}
									</Card.Body>
								</Card>

								<div className={'text-center'}>
									{
										!pageLoader ? <button className={'save__btn px-4 mb-4'} type={'submit'}>Save</button>
											: progressBar
									}
								</div>

							</Form>
							: progressBar
					}
				</Col>
			</Row>
		</div>
	);
};


export default GoogleApiWrapper({
	apiKey: process.env.REACT_APP_GOOGLE_MAP_API
})(Setting);

