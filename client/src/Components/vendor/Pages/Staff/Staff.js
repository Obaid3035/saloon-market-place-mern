import 'rc-time-picker/assets/index.css';
import 'react-confirm-alert/src/react-confirm-alert.css'
import React, { useEffect, useState } from 'react';
import { Card, Col, Modal, Row } from "react-bootstrap";
import RctCollapsibleCard from "../../../../lib/vendor/RctCollapsibleCard/RctCollapsibleCard";
import { Form, FormGroup, Input, Label } from "reactstrap";
import PageTitleBar from "../../../../lib/vendor/PageTitleBar/PageTitleBar";
import IntlMessages from "../../../../Util/IntlMessages";
import IconButton from "@material-ui/core/IconButton";
import Avatar_Img from '../../../../assets/customer/img/avatar.png'
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Switch from "@material-ui/core/Switch";
import { connect } from "react-redux";
import inputValidation from "../../../../Components/customer/Pages/Login/inputValidation";
import Avatar from 'react-avatar';
import { confirmAlert } from 'react-confirm-alert';
import './Staff.css';
import { Controller, useForm } from "react-hook-form";
import * as action from "../../../../Store/vendor/actions";
import axios from "axios";
import { deletedStaff, createdStaff, editStaff } from "../../../../Helpers/toastHelper";
import { get15Interval, get30Interval, getInterval } from "./Slots";
import { useToasts } from "react-toast-notifications";
import Loader from "../../../../lib/customer/Loader/Loader";

const Staff = props => {

	const [show, setShow] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const { addToast } = useToasts()
	const [submitLoader, setSubmitLoader] = useState(false);
	const token = localStorage.getItem('vendorToken');
	const [shopTiming, setShopTiming] = useState(null);
	const [serviceLength, setServiceLength] = useState(null)

	const [editFormData, setEditFormData] = useState(null);

	const days = [

		{
			label: "Monday",
			value: 1
		}, {
			label: "Tuesday",
			value: 2
		}, {
			label: "Wednesday",
			value: 3
		}, {
			label: "Thursday",
			value: 4
		}, {
			label: "Friday",
			value: 5
		}, {
			label: "Saturday",
			value: 6
		},
		{
			label: "Sunday",
			value: 0
		},
	];


	useEffect(() => {
		props.fetchStaff();
		axios.get('/vendor/shop-timing', { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				setShopTiming(res.data);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [submitLoader])


	const { register, handleSubmit, formState: { errors }, reset, control } = useForm();
	const [staffId, setStaffId] = useState('');
	const [interval, setInterval] = useState('');

	const animatedComponents = makeAnimated();

	const onDeleteHandler = (staffId) => {
		const options = {
			title: 'Delete Service',
			message: 'Are you sure you want to delete ?',
			buttons: [
				{
					label: 'Confirm',
					onClick: () => {
						setSubmitLoader(true)
						axios.delete('/vendor/staff/' + staffId, { headers: { "Authorization": `Bearer ${token}` } })
							.then((res) => {
								setSubmitLoader(false)
							}).catch((err) => {
								setSubmitLoader(false)
							})
						deletedStaff(addToast);
					}
				},
				{
					label: 'Cancel',
					onClick: () => alert('Click No')
				}
			],
			childrenElement: () => <div />,
			closeOnEscape: true,
			closeOnClickOutside: true,
			overlayClassName: "overlay-custom-class-name"     // Custom overlay class name
		};
		confirmAlert(options);
	}

	const editModalOpenHandler = (staffId) => {
		axios.get('/vendor/staff-edit/' + staffId, { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				if (res.data) {
					const slots = res.data.slots[0].split(',')
					res.data.slots = slots.map((slot) => {
						return {
							label: slot,
							value: slot
						}
					})
					let arr = [];
					days.forEach((data) => {
						res.data.availabilityDays.forEach((day) => {
							if (data.value === day) {
								arr.push(data);
							}
						})
					})
					console.log(arr)
					res.data.availabilityDays = arr
					res.data.services = res.data.services.map((service) => {
						return {
							value: service._id,
							label: service.serviceName
						}
					})
				}
				console.log(res.data)
				setEditFormData(res.data);
			})
		setStaffId(staffId)
		setShowEdit(!showEdit);
	}

	const modalOpenHandler = () => {
		setShow(!show);
	}

	const onFormSubmit = (data) => {
		setSubmitLoader(true);
		console.log(data);

		const availabilityDaysArr = [];
		const servicesArr = [];
		const slotArr = [];
		data.availabilityDays.forEach(day => availabilityDaysArr.push(day.value));
		console.log(availabilityDaysArr)
		data.services.forEach(service => servicesArr.push(service.value))
		console.log(servicesArr)
		data.slots.forEach((slot) => slotArr.push(slot.value))
		if (!data.visibility) {
			data.visibility = false
		}
		const formData = new FormData();
		formData.append("staffName", data.staffName);
		formData.append("profilePicture", data.profilePicture[0]);
		formData.append("interval", interval.value);
		formData.append("services", servicesArr);
		formData.append("visibility", data.visibility);
		formData.append("availabilityDays", availabilityDaysArr);
		formData.append("slots", slotArr);

		axios.post('/vendor/staff', formData, { headers: { "Authorization": `Bearer ${token}` } })
			.then(() => {
				setShow(!show)
				setSubmitLoader(false);
			})
			.catch(() => {
			})
		createdStaff(addToast)
		reset({})
	}

	const onEditFormSubmit = (data) => {
		setSubmitLoader(true);
		const availabilityDaysArr = [];
		const servicesArr = [];
		const slotArr = [];
		editFormData.availabilityDays.forEach(day => availabilityDaysArr.push(day.value));
		editFormData.services.forEach(service => servicesArr.push(service.value))
		editFormData.slots.forEach((slot) => slotArr.push(slot.value))
		if (!data.visibility) {
			data.visibility = false
		}



		const formData = new FormData();
		formData.append("staffName", editFormData.staffName);
		formData.append("profilePicture", data.profilePicture[0]);
		formData.append("interval", editFormData.interval);
		formData.append("services", servicesArr);
		formData.append("visibility", editFormData.visibility);
		formData.append("availabilityDays", availabilityDaysArr);
		formData.append("currentPicture", JSON.stringify(editFormData.profilePicture))
		formData.append("slots", slotArr);
		axios.put('/vendor/staff/' + staffId, formData, { headers: { "Authorization": `Bearer ${token}` } })
			.then(() => {
				setShowEdit(!showEdit)
				setSubmitLoader(false);
			})
			.catch(() => {
			})
		reset({})
		editStaff(addToast)
	}


	const daysPromiseHandler = () =>
		new Promise(resolve => {
			setTimeout(() => {
				resolve(days);
			}, 1000);
		});




	const servicesPromiseHandler = () =>
		new Promise(resolve => {
			axios.get('/vendor/staff-services', { headers: { "Authorization": `Bearer ${token}` } })
				.then((services) => {
					setServiceLength(services.data.length)
					resolve(services.data)
				})
		});




	const intervalOption = [

		{
			label: '15',
			value: '15'
		},
		{
			label: '30',
			value: '30'
		},
		{
			label: '60',
			value: '60'
		},
	]

	let name, value;
	const onChangeHandler = (e) => {
		name = e.target.name
		value = e.target.value;
		setEditFormData({ ...editFormData, [name]: value })

		console.log(editFormData)
	}


	const intervalHandleChange = selectedOption => {
		setInterval(selectedOption)
	};

	const editInterHandleChange = selectedOption => {
		console.log(selectedOption)
		setEditFormData({
			...editFormData,
			interval: selectedOption.value,
		})
		console.log(editFormData)
	};

	const handleInputChange = (newValue) => {
		setEditFormData({
			...editFormData,
			services: newValue
		})
	};

	const DayInputChange = (newValue) => {
		setEditFormData({
			...editFormData,
			availabilityDays: newValue
		})
	};

	const onSlotHandler = (newValue) => {
		setEditFormData({
			...editFormData,
			slots: newValue
		})
	};

	const handleClose2 = () => setShowEdit(false);


	const editModal = (
		<Modal show={showEdit} size={'lg'} className="StaffEditCard">
			<Modal.Body>
				<div className="d-flex justify-content-between align-items-center">
					<p>Edit Staff</p>
					<p style={{ cursor: "pointer", fontSize: "20px" }} onClick={handleClose2} title="Close Staff">X</p>
				</div>
				{
					editFormData && editFormData.services ?
						<Form onSubmit={handleSubmit(onEditFormSubmit)}>
							<FormGroup>
								<Label for="name">Staff Name</Label>
								<Input type="text" name="staffName" placeholder="Staff Name" value={editFormData.staffName} onChange={onChangeHandler} required />
							</FormGroup>
							<FormGroup>
								<Label for="name">Select Services</Label>
								<AsyncSelect
									name="services"
									isMulti
									cacheOptions
									defaultOptions
									required
									value={editFormData.services}
									onChange={handleInputChange}
									components={animatedComponents}
									loadOptions={servicesPromiseHandler}
								/>
							</FormGroup>
							<FormGroup>
								<Label>Interval</Label>
								<div className="col-sm-12">
									<Select
										closeMenuOnSelect={false}
										required
										components={animatedComponents}
										options={intervalOption}
										value={{ value: editFormData.interval, label: editFormData.interval }}
										onChange={editInterHandleChange}
									/>
								</div>
							</FormGroup>
							{
								editFormData.interval === '15' ? <FormGroup>
									<Label for="name">Select Slots</Label>
									<Select
										className="basic-single"
										isMulti
										classNamePrefix="select"
										value={editFormData.slots}
										defaultOptions
										required
										onChange={onSlotHandler}
										name="color"
										options={get15Interval(shopTiming)}
									/>
								</FormGroup> : editFormData.interval === '30' ? <FormGroup>
									<Label for="name">Select Slots</Label>
									<Select
										className="basic-single"
										isMulti
										classNamePrefix="select"
										value={editFormData.slots}
										defaultOptions
										required
										onChange={onSlotHandler}
										name="color"
										options={get15Interval(shopTiming)}
									/>

								</FormGroup> : editFormData.interval === '60' ? <FormGroup>
									<Label for="name">Select Slots</Label>
									<Select
										className="basic-single"
										isMulti
										classNamePrefix="select"
										value={editFormData.slots}
										defaultOptions
										required
										onChange={onSlotHandler}
										name="color"
										options={get15Interval(shopTiming)}
									/>
								</FormGroup> : <p>Please select interval</p>
							}
							<FormGroup>
								<Label for="name">Visibility</Label>
								<Switch
									name={'visibility'}
									checked={editFormData.visibility}
									defaultValue={editFormData.visibility}
									onChange={(e) => setEditFormData({
										...editFormData,
										visibility: e.target.checked
									})}
									required
									color={'default'}
								/>

							</FormGroup>

							<div className="form-group">
								<label htmlFor="exampleFormControlFile1">Profile Picture</label>
								<input type="file"
									accept=".png, .jpg, .jpeg"
									className="form-control-file"
									{...register('profilePicture')} />
							</div>

							<FormGroup>
								<Label for="name">Select Off Days</Label>

								<AsyncSelect
									name={'availabilityDays'}
									isMulti
									cacheOptions
									required
									defaultOptions
									value={editFormData.availabilityDays}
									onChange={DayInputChange}
									components={animatedComponents}
									loadOptions={daysPromiseHandler}
								/>

							</FormGroup>

							<div className={'text-center'}>
								{
									!submitLoader ?
										<button type={'submit'} className={'table__btn px-4'}>Edit</button> :
										(
											<Loader />
										)
								}
							</div>
						</Form>
						: null
				}
			</Modal.Body>
		</Modal>
	)

	const handleClose = () => setShow(false);

	const modal = (
		<Modal show={show} size={'lg'} className="StaffEditCard">
			<Modal.Body>
				<div className="d-flex justify-content-between align-items-center">
					<p>Add Staff</p>
					<p style={{ cursor: "pointer", fontSize: "20px" }} onClick={handleClose} title="Close Staff">X</p>
				</div>
				<Form onSubmit={handleSubmit(onFormSubmit)}>
					<FormGroup>
						<Label for="name">Staff Name</Label>
						<Input
							type="text"
							name="staffName"
							placeholder="Staff Name"
							
							{...register('staffName')}
						/>
						{/* <small className="text-danger" style={{ fontSize: "10px" }}>
							{errors.staffName && errors.staffName.message}
						</small> */}
					</FormGroup>
					<FormGroup>
					<Label for="name">Select Services</Label>
						{
							serviceLength === 0 ? 
							<p className={'text-danger'}> Please create Service before creating Staff </p> :
							<Controller
							name="services"
							control={control}
							onChange={onChangeHandler}
							render={({ field: { value, onChange, ref } }) => (
								<AsyncSelect
									name={'serviceName'}
									isMulti
									cacheOptions
									defaultOptions
									value={value}
									
									onChange={onChange}
									components={animatedComponents}
									loadOptions={servicesPromiseHandler}
								/>
							)}
						/>
						}
						
					
					</FormGroup>

					<FormGroup>
						<Label>Interval</Label>
						<div className="col-sm-12">
							<Select
								closeMenuOnSelect={false}
								components={animatedComponents}
								options={intervalOption}
								value={interval}
								
								onChange={intervalHandleChange}
							/>
						</div>
						<small className="text-danger" style={{ fontSize: "10px" }}>
							{errors.interval && errors.interval.message}
						</small>
					</FormGroup>
					{
						interval && interval.value === '15' ? <FormGroup>
							<Label for="name">Select Slots</Label>
							<Controller
								name="slots"
								control={control}
								render={({ field: { value, onChange, ref } }) => (
									<Select
										className="basic-single"
										isMulti
										classNamePrefix="select"
										value={value}
										defaultOptions
										
										onChange={onChange}
										name="color"
										options={get15Interval(shopTiming)}
									/>

								)}
							/>
						</FormGroup> : interval.value === '30' ? <FormGroup>
							<Label for="name">Select Slots</Label>
							<Controller
								name="slots"
								control={control}
								render={({ field: { value, onChange, ref } }) => (
									<Select
										className="basic-single"
										isMulti
										classNamePrefix="select"
										
										value={value}
										defaultOptions
										onChange={onChange}
										name="color"
										options={get30Interval(shopTiming)}
									/>

								)}
							/>
						</FormGroup> : interval.value === '60' ? <FormGroup>
							<Label for="name">Select Slots</Label>
							<Controller
								name="slots"
								control={control}
								render={({ field: { value, onChange, ref } }) => (


									<Select
										className="basic-single"
										isMulti
										
										classNamePrefix="select"
										value={value}
										defaultOptions
										onChange={onChange}
										name="color"
										options={getInterval(shopTiming)}
									/>

								)}
							/>
						</FormGroup> : <p>Please select interval</p>
					}
					<FormGroup>
						<Label for="name">Visibility</Label>
						<Controller
							name="visibility"
							control={control}
							// rules={inputValidation.visibility}
							render={({ field: { value, onChange, ref } }) => (
								<Switch
									value={value}
									onChange={onChange}
									defaultValue={false}
									name={'visible'}
									color={'default'}
									
								/>
							)}
						/>
						{/* <small className="text-danger" style={{ fontSize: "10px" }}>
							{errors.visibility && errors.visibility.message}
						</small> */}
					</FormGroup>

					<div className="form-group">
						<label htmlFor="exampleFormControlFile1">Profile Picture</label>
						<input type="file"
							accept=".png, .jpg, .jpeg"
							className="form-control-file"
							{...register('profilePicture')} required />
						{/* <small className="text-danger" style={{ fontSize: "10px" }}>
							{errors.profilePicture && errors.profilePicture.message}
						</small> */}
					</div>

					<FormGroup>
						<Label for="name">Select Off Days</Label>

						<Controller
							name="availabilityDays"
							// rules={inputValidation.availabilityDays}
							control={control}
							render={({ field: { value, onChange, ref } }) => (
								<AsyncSelect
									name={'availabilityDays'}
									isMulti
									cacheOptions
									value={value}
									defaultOptions
									onChange={onChange}
									components={animatedComponents}
									loadOptions={daysPromiseHandler}
									required
								/>
							)}
						/>
						{/* <small className="text-danger" style={{ fontSize: "10px" }}>
							{errors.availabilityDays && errors.availabilityDays.message}
						</small> */}
					</FormGroup>
					<div className={'text-center'}>
						{
							!submitLoader ?
								<button type={'submit'} className={'table__btn px-4'}>Add</button> :
								(
									<Loader />

								)
						}
					</div>
				</Form>
			</Modal.Body>
		</Modal>
	)

	let staff = (
		<div className="progress__bar">
			<Loader style={'text-center'} />
		</div>
	)

	if (!submitLoader && props.staff && props.staff.length === 0) {
		staff = (
			<div className={'text-center'}>
				<p>No Staff Found</p>
			</div>
		)
	}
	const weeks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	if (!submitLoader && props.staff && props.staff.length > 0) {
		console.log(props.staff)
		staff = props.staff.map((staff) => (
			<Col md={6} className={'mt-3'}>
				<Card className={'shadow-lg p-5'}>
					<Card.Body className={'d-flex align-items-center justify-content-between'}>
						<div className={'d-flex align-items-center'}>
							<Avatar src={staff.profilePicture.avatar} size="70" round={true} />
							<div className={'ml-3 pt-3'}>
								<div className={'d-flex justify-content-between'}>
									<h5 className={'staff__name pr-4'}>{staff.staffName}</h5>
								</div>
								<ul className={'list-inline'}>
									{
										staff.availabilityDays.map((day) => (
											<li className={'list-inline-item'}>{weeks[day]}</li>
										))
									}
								</ul>
							</div>
						</div>
						<div>
							<p>{staff.visibility ? 'Visible' : 'Invisible'}</p>
						</div>
						<div className="btn-group">
							<IconButton className="text-success px-2" aria-label="Edit" onClick={() => editModalOpenHandler(staff._id)}><i className="zmdi zmdi-edit" /></IconButton>
							<IconButton className="text-danger px-2" aria-label="Delete" onClick={() => onDeleteHandler(staff._id)}><i className="zmdi zmdi-delete" /></IconButton>
						</div>
					</Card.Body>
				</Card>
			</Col>
		))
	}

	return (
		<div>
			{modal}
			{editModal}
			<PageTitleBar title={<IntlMessages id="sidebar.staff" />} match={props.match} />
			<Row className={'justify-content-end'}>
				<Col md={2} sm={12} lg={1} className="mr-1">
					<button className={'text-center table__btn'}
						onClick={modalOpenHandler}>Add</button>
				</Col>
			</Row>

			<div style={{ margin: '12px' }}>
				<Row className={'justify-content-center'}>
					{staff}
				</Row>
			</div>
		</div>
	);
};

const mapStateToProps = state => {
	return {
		staff: state.staff.staff,
		submitLoader: state.staff.submitLoader,
		loading: state.staff.loading,
		storeId: state.staff.storeId,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		createStaff: (formInput) => dispatch(action.createStaff(formInput)),
		fetchStaff: () => dispatch(action.fetchStaff()),
		editStaff: (staffId, formData) => dispatch(action.editStaff(staffId, formData)),
		deleteStaff: (staffId) => dispatch(action.deleteStaff(staffId))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Staff);