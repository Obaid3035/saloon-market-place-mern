import React, { Fragment, useState, useEffect } from 'react';
import { Col, Modal, Row } from "react-bootstrap";
import RctCollapsibleCard from "../../../../lib/vendor/RctCollapsibleCard/RctCollapsibleCard";
import { Form, FormGroup, Input, Label } from "reactstrap";
import {NavLink} from "react-router-dom"
import PageTitleBar from "../../../../lib/vendor/PageTitleBar/PageTitleBar";
import IntlMessages from "../../../../Util/IntlMessages";
import { Controller, useForm } from "react-hook-form";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import * as action from '../../../../Store/vendor/actions/index'
import { connect } from "react-redux";
import './Service.css'
import ProgressBar from "../../../../lib/customer/ProgressBar/ProgressBar";
import { confirmAlert } from "react-confirm-alert";
import { deleted, created, serviceEditSuccessfully } from "../../../../Helpers/toastHelper";
import { useToasts } from 'react-toast-notifications'
import inputValidation from "../../../../Components/customer/Pages/Login/inputValidation";
import AsyncSelect from 'react-select/async';
import axios from "axios";
import {
	createServiceFail,
	createServiceSuccess,
	deleteServiceFail,
	deleteServiceSuccess
} from "../../../../Store/vendor/actions/service";
import Loader from "../../../../lib/customer/Loader/Loader";



const Service = props => {
	const { addToast } = useToasts()
	const [show, setShow] = useState(false);

	const [editShow, setEditShow] = useState(false);
	const { register, handleSubmit, formState: { errors }, reset, control } = useForm();

	const [buttonStatus, setButtonStatus] = useState('')
	const columns = ['Name', 'Price', 'Category', 'Description', 'Duration', 'Actions'];
	const [serviceId, setServiceId] = useState('');
	const [loader, setLoader] = useState(false);
	const [submitLoader, setSubmitLoader] = useState(false);
	const [tableLoader, setTableLoader] = useState(false);
	const [categoryLength, setCategoryLength] = useState(null)

	useEffect(() => {
		props.getAllServices();
	}, [submitLoader])

	const onFormSubmit = (data) => {
		setSubmitLoader(true);
		
		axios.post('/vendor/service', data, { headers: { "Authorization": `Bearer ${token}` } })
			.then(() => {
				setShow(!show)
				setSubmitLoader(false);
			}).catch(() => {
			})

		created(addToast)
		reset({})

	}



	const modalOpenHandler = () => {
		setShow(!show);
	}

	const onDeleteHandler = (serviceId) => {
		const options = {
			title: 'Delete Service',
			message: 'Are you sure you want to delete ?',
			buttons: [
				{
					label: 'Confirm',
					onClick: () => {
						setSubmitLoader(true)
						axios.delete('/vendor/service/' + serviceId, { headers: { "Authorization": `Bearer ${token}` } })
							.then(() => {
								setSubmitLoader(false)
							})
							.catch(() => {
								setSubmitLoader(false)
							})
						deleted(addToast)
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
			overlayClassName: "overlay-custom-class-name"
		};
		confirmAlert(options);
	}

	let serviceTable = (
		<div className={'progress__bar'}>
			<Loader />
		</div>
	)

	if (!submitLoader && props.services && props.services.length === 0) {
		serviceTable = <p className={'text-center'}>No Service Found</p>
	}



	if (!submitLoader && props.services && props.services.length > 0) {
		serviceTable = (
			<Table>
				<TableHead>
					<TableRow hover>
						{
							columns.map((col, index) => (
								<TableCell key={index}>{col}</TableCell>
							))
						}
					</TableRow>
				</TableHead>
				<TableBody>
					<Fragment>
						{
							props.services.map((service, index) => (
								<TableRow hover key={index}>
									<TableCell> {service.serviceName} </TableCell>
									<TableCell>Aed {service.price}</TableCell>
									<TableCell>{service.category}</TableCell>
									<TableCell>{service.description}</TableCell>
									<TableCell>{service.duration}</TableCell>
									<TableCell>
										<IconButton className="text-success" onClick={() => editModalOpenHandler(service._id)} aria-label="Edit"><i className="zmdi zmdi-edit" /></IconButton>
										<IconButton className="text-danger px-2" aria-label="Delete" onClick={() => onDeleteHandler(service._id)}><i className="zmdi zmdi-delete" /></IconButton>
									</TableCell>
								</TableRow>
							))
						}
					</Fragment>
				</TableBody>
			</Table>
		)
	}
	const token = localStorage.getItem('vendorToken');

	const categoriesPromiseHandler = () =>
		new Promise(resolve => {
			axios.get('/vendor/staff-categories', { headers: { "Authorization": `Bearer ${token}` } })
				.then((res) => {
					setCategoryLength(res.data.length)
					resolve(res.data)
				})
		});

	const [service, setService] = useState(null);
	const [categoryShow, setCategoryShow] = useState(false);

	const editModalOpenHandler = (serviceId) => {
		setEditShow(!editShow);
		setServiceId(serviceId);
		axios.get('/vendor/service/' + serviceId)
			.then((res) => {
				res.data.category = {
					label: res.data.category,
					value: res.data.category,
				}
				setService(res.data)
			})
	}

	console.log("errrrr", errors)

	const modal = (
		<Modal show={show} size={'lg'}>
			<Modal.Body>
				<div className="d-flex justify-content-between align-items-center">
					<p>{`Add Service`}</p>
					<p style={{ cursor: "pointer", fontSize: "20px" }} onClick={() => setShow(false)} title="Close Staff">X</p>
				</div>
				<Form onSubmit={handleSubmit(onFormSubmit)}>
					<FormGroup>
						<Label for="name">Name</Label>
						<Input type="text" placeholder="Name"  {...register('serviceName', inputValidation.serviceName)} />
						<small className="text-danger">
							{errors.serviceName && errors.serviceName.message}
						</small>
					</FormGroup>
					<FormGroup>
						<Label for="price">Price</Label>
						<Input type="number" placeholder="Price" {...register('price', inputValidation.price)} />
						<small className="text-danger">
							{errors.price && errors.price.message}
						</small>
					</FormGroup>
					<FormGroup>
						<Label for="Select">Category</Label>
						{
							categoryLength === 0 ?
								<p className="text-danger"> Select a category or <NavLink to="/vendor/category"> Create a New One </NavLink> </p>
								:
								<Controller
									name="category"
									rules={{ required: true }}
									control={control}
									render={({ field: { value, onChange, ref } }) => (
										<AsyncSelect
											name={'serviceName'}
											cacheOptions
											defaultOptions
											value={value}
											onChange={onChange}
											loadOptions={categoriesPromiseHandler}
										/>
									)}
								/>
						}

						<small className="text-danger">
							{errors.category && errors.category.type}
						</small>
					</FormGroup>
					<FormGroup>
						<Label>Duration</Label>
						<Input type="number" placeholder="Duration" {...register('duration', inputValidation.duration)} />
						<small className="text-danger">
							{errors.duration && errors.duration.message}
						</small>
					</FormGroup>
					<FormGroup>
						<Label>Description</Label>
						<Input type="textarea" height={1200} {...register('description', inputValidation.description)} />
						<small className="text-danger">
							{errors.description && errors.description.message}
						</small>
					</FormGroup>
					<div className={'text-center'}>
						{
							!submitLoader ? (
								<button type={'submit'} className={'table__btn px-4'}>Submit</button>
							) : <Loader />
						}
					</div>
				</Form>
			</Modal.Body>
		</Modal>
	)

	const onChangeHandler = (e) => {
		const value = e.target.value;
		setService({
			...service,
			[e.target.name]: value
		})
	}

	const handleInputChange = (newValue) => {
		setService({
			...service,
			category: newValue
		})
	};

	const onEditFormSubmit = (e) => {
		e.preventDefault();
		setSubmitLoader(true);

		axios.put('/vendor/service/' + serviceId, service)
			.then((res) => {
				setEditShow(!editShow)
				setSubmitLoader(false);
				serviceEditSuccessfully(addToast)
				console.log(res.data);
			})
	}

	const editModal = (
		<Modal show={editShow} size={'lg'}>
			<Modal.Body>
				<div className="d-flex justify-content-between align-items-center">
					<p>Edit Service</p>
					<p style={{ cursor: "pointer", fontSize: "20px" }} onClick={() => setEditShow(false)} title="Close Staff">X</p>
				</div>
				{
					service ? <Form onSubmit={onEditFormSubmit}>
						<FormGroup>
							<Label for="name">Name</Label>
							<Input type="text" placeholder="Name" required name={'serviceName'} value={service.serviceName} onChange={onChangeHandler} />
						</FormGroup>
						<FormGroup>
							<Label for="price">Price</Label>
							<Input type="text" placeholder="Price" required name={'price'} value={service.price} onChange={onChangeHandler} />
						</FormGroup>
						<FormGroup>
							<Label for="Select">Category</Label>
							<AsyncSelect
								name={'serviceName'}
								required
								cacheOptions
								defaultOptions
								value={service.category}
								onChange={handleInputChange}
								loadOptions={categoriesPromiseHandler}
							/>
						</FormGroup>
						<FormGroup>
							<Label>Duration</Label>
							<Input type="number" placeholder="Duration" required name={'duration'} value={service.duration} onChange={onChangeHandler} />
						</FormGroup>
						<FormGroup>
							<Label>Description</Label>
							<Input type="textarea" height={1200} required name={'description'} value={service.description} onChange={onChangeHandler} />
						</FormGroup>
						<div className={'text-center'}>
							{
								!submitLoader ? (
									<button type={'submit'} className={'table__btn px-4'}>Edit</button>
								) : <Loader />
							}
						</div>
					</Form>
						: null
				}
			</Modal.Body>
		</Modal>
	)


	return (
		<div>
			{modal}
			{editModal}
			<PageTitleBar title={<IntlMessages id="sidebar.service" />} match={props.match} />
			<Row className={'justify-content-end'}>
				<Col md={2} sm={12} lg={1} className="mr-1">
					<button className={'text-center table__btn'}
						onClick={modalOpenHandler}
					>Add</button>
				</Col>
			</Row>

			<div style={{ marginTop: '12px' }}>
				<RctCollapsibleCard heading="Service list" fullBlock>
					<div className="table-responsive align-items-center ">
						{
							serviceTable
						}
					</div>
				</RctCollapsibleCard>
			</div>
		</div>
	);
};

const mapStateToProps = state => {
	return {
		services: state.service.services,
		loading: state.service.loading,
		submitLoader: state.service.submitLoader
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getAllServices: () => dispatch(action.fetchService()),
		createService: (formInput) => dispatch(action.createService(formInput)),
		editService: (serviceId, data) => dispatch(action.editService(serviceId, data)),
		deleteService: (serviceId) => dispatch(action.deleteService(serviceId))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Service);