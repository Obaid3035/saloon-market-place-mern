import React, {useEffect, useState} from 'react';
import { Card, Col, Form, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import ProgressBar from "../../../../lib/customer/ProgressBar/ProgressBar";
import axios from "axios";
import 'react-dropzone-component/styles/filepicker.css';
import 'dropzone/dist/min/dropzone.min.css'
import DropzoneComponent from 'react-dropzone-component';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {GoogleApiWrapper, Map, Marker} from 'google-maps-react';
import GooglePlacesAutocomplete, { getLatLng, geocodeByAddress } from 'react-google-places-autocomplete';

import './ShopCreate.css'
import { getFull30Interval} from "../Staff/Slots";

const ShopCreate = props => {
	const [fileNames, setFileNames] = useState([]);
	const [description, setDescription] = useState('');
	const [openingTime, setOpeningTime] = useState([]);
	const [formData, setFormData] = useState({
		day: { label: "monday", value: 1 },
		checkIn: { label: "09:00", value: "09:00" },
		checkOut: { label: "09:00", value: "09:00" },
	});


	const [selectedLocation, setSelectedLocation] = useState( null)

	const [isAllDay, setIsAllDay] = useState(false)
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

	const djsConfig = {
		addRemoveLinks: true,
		acceptedFiles: "image/jpeg,image/png,image/gif",
		autoProcessQueue: false
	};

	const componentConfig = {
		iconFiletypes: ['.jpg', '.png', '.gif'],
		showFiletypeIcon: true,
		postUrl: 'no-url'
	};


	// // Simple callbacks work too, of course
	const imgArr = [];
	const callback = (files) => {
		imgArr.push(files);
		setFileNames(imgArr);
	}

	const removedfile = file => {
		const selectedIndex = imgArr.findIndex((val, index) => {
			if (imgArr[index] === file) {
				return index
			}
			return false
		})
		const newArr = imgArr.splice(selectedIndex, 1)
		setFileNames(newArr)
	};

	const eventHandlers = {
		addedfile: callback,
		removedfile: removedfile,
	}


	const { register, handleSubmit, control, formState: { errors } } = useForm();

	const [loader, setLoader] = useState(false);
	const token = localStorage.getItem('vendorToken');

	const onSubmit = data => {
		let schedule = {

		}

		openingTime.forEach((val) => {
			schedule[Object.keys(val)[0]] = val[Object.keys(val)[0]]
		})

		setLoader(true);
		const formData = new FormData();
		formData.append('shopName', data.shopName);
		formData.append('shopType', data.shopType.value);
		formData.append('description', description);
		formData.append('shopVisibility', data.shopVisibility);
		formData.append('schedule', JSON.stringify(schedule));
		formData.append('location', JSON.stringify(selectedLocation));
		formData.append('address', data.address);
		formData.append('shopImage', data.shopImage[0]);
		formData.append('shopBannerImage', data.shopBannerImage[0]);
		for (const key of Object.keys(fileNames)) {
			formData.append('gallery', fileNames[key]);
		}

		axios.post('/vendor/shop', formData, { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				localStorage.setItem('isProfileSetup', res.data.profileSetup);
				window.location.href = '/vendor/dashboard/'
				setLoader(false)
			}).catch(() => {
			setLoader(false)
		})
	};



	const onSelectHandler = (i, name) => {
		setFormData({
			...formData,
			[name]: i
		})
	}

	const onAllDayHandler = (e) => {
		setIsAllDay(!isAllDay)
		if (!isAllDay) {
			setFormData({
				...formData,
				checkIn: { label: "00:00", value: "00:00" },
				checkOut: { label: "23:45", value: "23:45" },
			})
		}
	}
	const onAddHandler = () => {
		let arr = [{
			[formData.day.label]: `${formData.checkIn.value}-${formData.checkOut.value}`
		}];

		let bool = true;
		if(openingTime.length > 0) {
			for(let i = 0; i < openingTime.length; i++) {
				if (Object.keys(arr[0])[0] === Object.keys(openingTime[i])[0]) {
					bool = false;
				}
			}
		}

		if (bool) {
			const joined = openingTime.concat(arr);
			setOpeningTime(joined)
		}


		if (openingTime.length === 0) {
			const joined = openingTime.concat(arr);
			setOpeningTime(joined)
		}

	}

	const shopTypeOption = [
		{
			label: 'Aesthetic Doctor',
			value: 'Aesthetic Doctor'
		},
		{
			label: 'Barbers',
			value: 'Barbers'
		},
		{
			label: 'Beautician',
			value: 'Beautician'
		},
		{
			label: 'Smile Dentist',
			value: 'Smile Dentist'
		},
	]

	const editorChangeHandler = (val) => {
		setDescription(val);
	}

	const days = [

		{
			label: "monday",
			value: 1
		}, {
			label: "tuesday",
			value: 2
		}, {
			label: "wednesday",
			value: 3
		}, {
			label: "thursday",
			value: 4
		}, {
			label: "friday",
			value: 5
		}, {
			label: "saturday",
			value: 6
		},
		{
			label: "sunday",
			value: 0
		},
	];

	const onRemoveOpeningHours = (id) => {
		const newArr = openingTime.concat();
		newArr.forEach((el, index) => {
			if (Object.keys(el)[0] === Object.keys(id)[0]) {
				newArr.splice(index, 1)
			}
		})
		setOpeningTime(newArr)

	}

	const [markerLocation, setMarkerLocation] = useState(null);

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


	const fetchPlaces = (mapProps, map) => {
		const {google} = mapProps;
		const service = new google.maps.places.PlacesService(map);
	}

	const [value, setValue] = useState(null);
	const onPlaceSearch =  (val) => {
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


	const getCurrentLocation = () => {
		setSelectedLocation(null)
		navigator.geolocation.getCurrentPosition(function(position) {
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
			<h3 className={'text-center'}>Create Your Shop</h3>
			<Row className={'justify-content-center'}>
				<Col md={8}>
					<Form onSubmit={handleSubmit(onSubmit)}>
						<Card>
							<Card.Body>
								<Form.Group>
									<Form.Label> Shop Name </Form.Label>
									<Form.Control type={'text'} required {...register("shopName")} />
								</Form.Group>

								<Form.Group className={'py-3'}>
									<Form.Label> Shop Type </Form.Label>
									<Controller
										name="shopType"
										control={control}
										render={({ field: { value, onChange, ref } }) => (


											<Select
												className="basic-single"
												classNamePrefix="select"
												value={value}
												defaultOptions
												required
												onChange={onChange}
												name="color"
												options={shopTypeOption}
											/>

										)}
									/>
								</Form.Group>

								<Form.Group className={'py-3'}>
									<Form.Label> Shop Description </Form.Label>
									<ReactQuill name="description" onChange={editorChangeHandler} value={description} modules={modules} formats={formats} placeholder="Leave Your Description" />
								</Form.Group>
							</Card.Body>
						</Card>

						<Card className={'my-4'}>
							<Card.Body>
								<p className={'text-center'}>Opening Hour</p>
								<Form.Group className={'py-3'}>
									<Row className={'align-items-center'}>
										<div style={{ width: '15%'}} className={'col-md-2 mx-2'}>
											<Select
												className="basic-single"
												maxMenuHeight={190}
												options={days}
												value={formData.day}
												onChange={(value) => onSelectHandler(value, 'day')}
												classNamePrefix="select"
												defaultOptions
												required
												name="color"
											/>
										</div>
										<div style={{ width: '15%'}} className={'col-md-2'}>
											<Select
												className="basic-single"
												maxMenuHeight={190}
												options={getFull30Interval()}
												value={formData.checkIn}
												isDisabled={isAllDay}
												onChange={(value) => onSelectHandler(value, 'checkIn')}
												classNamePrefix="select"
												defaultOptions
												required
												name="color"
											/>
										</div>
										<div style={{ width: '15%'}} className={'col-md-2 mx-2'}>
											<Select
												className="basic-single"
												maxMenuHeight={190}
												value={formData.checkOut}
												isDisabled={isAllDay}
												classNamePrefix="select"
												onChange={(value) => onSelectHandler(value, 'checkOut')}
												defaultOptions
												options={getFull30Interval()}
												required
												name="color"
											/>
										</div>
										<Form.Group className={'col-md-4'}>
											<Form.Check type="checkbox" label="24 Hours" value={isAllDay} onChange={onAllDayHandler}/>
										</Form.Group>
										<div className={'col-md-1'}>
											<i className="zmdi zmdi-plus-square text-right add__btn" style={{fontSize: '30px'}} onClick={onAddHandler}/>
										</div>

									</Row>
									<div className="my-4">
										{
											openingTime.map((val) => (
												<Row className={'align-items-center p-0 my-2 mx-0 justify-content-center opening__tabs'}>
													<Col md={3}>
														<h6 className={'m-0'}>{Object.keys(val)}</h6>
													</Col>
													<Col md={4}>
														<p className={'text-muted m-0'}>{val[Object.keys(val)[0]]}</p>
													</Col>
													<Col md={3} className={'text-right mt-2'}>
														<h6><i className="zmdi zmdi-close-circle remove__btn" onClick={() => onRemoveOpeningHours(val)} style={{fontSize: '30px'}} />
														</h6>
													</Col>
												</Row>
											))
										}
									</div>
								</Form.Group>
							</Card.Body>
						</Card>

						<Card className={'my-4'}>
								<p className={'text-center'}> Shop Address </p>
							<Form.Group>
								<Form.Label> Address </Form.Label>
								<Form.Control type={'text'} required {...register("address")} />
							</Form.Group>
								<Row className={'align-items-center justify-content-center mt-4'}>
									<Col sm={8}>
										<GooglePlacesAutocomplete
											apiKey={process.env.REACT_APP_GOOGLE_MAP_API}
											autocompletionRequest={{
												bounds: [
													{ lat: 50, lng: 50 },
													{ lat: 100, lng: 100 }
												],
												componentRestrictions: {
													country: ['ae'],
												}
											}}
											selectProps={{
												placeholder:'Enter Location',
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
										<div className={'mb-4'} style={{height: '400px'}}>
											<Map google={props.google}
											     initialCenter={selectedLocation}
											     onReady={fetchPlaces}
											     zoom={14}
											     onClick={onMapClickHandler}
											>
												<Marker position={markerLocation}  name={'Your position'} />
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
								<p className={'text-center'}>Gallery</p>
								<Form.Group className={'py-3'}>
									<label htmlFor="exampleFormControlFile1">Shop Main Image</label>
									<input type="file"
									       required
									       accept=".png, .jpg, .jpeg"
									       className="form-control-file"
									       {...register('shopImage')} />
								</Form.Group>

								<Form.Group className={'py-3'}>
									<label htmlFor="exampleFormControlFile1">Shop Banner Image</label>
									<input type="file"
									       required
									       accept=".png, .jpg, .jpeg"
									       className="form-control-file"
									       {...register('shopBannerImage')} />
								</Form.Group>
								<DropzoneComponent
									config={componentConfig}
									eventHandlers={eventHandlers}
									djsConfig={djsConfig}
								/>
							</Card.Body>
						</Card>

						<div className={'text-center mb-5'}>
							{
								loader ? <p> please wait while we are generating your shop </p> : <button className={'save__btn px-4'} type={'submit'}>Save</button>
							}
						</div>
					</Form>
				</Col>
			</Row>
		</div>
	);
};

export default GoogleApiWrapper({
	apiKey: process.env.REACT_APP_GOOGLE_MAP_API
})(ShopCreate);
