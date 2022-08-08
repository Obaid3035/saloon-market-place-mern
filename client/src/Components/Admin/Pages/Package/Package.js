import React, { Fragment, useEffect, useState } from 'react';
import PageTitleBar from "../../../../lib/vendor/PageTitleBar/PageTitleBar";
import IntlMessages from "../../../../Util/IntlMessages";
import axios from "axios";
import {Col, Modal, Row} from "react-bootstrap";
import { Form, FormGroup, Input, Label } from "reactstrap";
import RctCollapsibleCard from "../../../../lib/vendor/RctCollapsibleCard/RctCollapsibleCard";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Loader from "../../../../lib/customer/Loader/Loader";
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import {  useForm } from "react-hook-form";


const Package = props => {
	const [showEdit, setShowEdit] = useState();
	const [addShow, setAddShow] = useState();
	const [packages, setPackages] = useState(null);
	const columns = ['Name', 'Description', 'Price'];
	const [selectedPackage, setSelectedPackage] = useState(null);
	// const [appointments, setAppointments] = useState(null);
	const [submitLoader, setSubmitLoader] = useState(false);

	const { register, handleSubmit, formState: { errors }, reset, control } = useForm();
	const adminToken = localStorage.getItem('adminToken');
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		price: 0
	})


	useEffect(() => {
		axios.get('/admin/packages',{headers: {"Authorization": `Bearer ${adminToken}`}})
			.then((res) => {
				setPackages(res.data)
			})


	}, [submitLoader])


	const handleClose2 = (i) => {
		setSelectedPackage(i);
		setFormData({
			name: i.name,
			description: i.description,
			price: i.price,
		})
		setShowEdit(true);
	}

	const closeButton = () => setShowEdit(false)


	const handleClose1 = () => setAddShow(false)



	const onAddFormSubmit = (data) => {
		setSubmitLoader(true);

		console.log(data)
		axios.post('/admin/package', data,{headers: {"Authorization": `Bearer ${adminToken}`}})
			.then((res) => {
				setAddShow(!addShow)
				setSubmitLoader(false);
			})
		reset({})
	}

	const addModal = (
		<Modal show={addShow} size={'lg'} className="StaffEditCard">
			<Modal.Body>
				<div className="d-flex justify-content-between align-items-center">
					<p>Add </p>
					<p style={{ cursor: "pointer", fontSize: "20px" }} onClick={handleClose1} title="Close Staff">X</p>
				</div>
				<Form onSubmit={handleSubmit(onAddFormSubmit)}>
					<FormGroup>
						<Label for="name"> Name</Label>
						<Input
							type="text"
							name="name"
							placeholder=" Name"
							required
							{...register('name')}
						/>
					</FormGroup>
					<FormGroup>
						<Label for="description"> Description</Label>
						<Input
							type="text"
							name="description"
							placeholder="Description"
							required
							{...register('description')}
						/>
					</FormGroup>
					<FormGroup>
						<Label for="price"> Price</Label>
						<Input
							type="number"
							name="price"
							placeholder="Price"
							required
							{...register('price')}
						/>
					</FormGroup>

					<div className={'text-center'}>
						{
							!submitLoader ? (
								<button type={'submit'} className={'table__btn px-4'}>ADD</button>
							) : <Loader />
						}
					</div>

				</Form>
			</Modal.Body>
		</Modal>
	)


	const onChangeHandler = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		})
	}

	const onEditSubmit = (e) => {
		e.preventDefault();

		axios.put('/admin/package/'+ selectedPackage._id, formData,{headers: {"Authorization": `Bearer ${adminToken}`}})
			.then((res) => {
				setShowEdit(!showEdit)
				setSubmitLoader(false);
			})
	}

	const editModal = (
		<Modal show={showEdit} size={'lg'} className="StaffEditCard">
			<Modal.Body>
				<div className="d-flex justify-content-between align-items-center">
					<p>EDIT</p>
					<p style={{ cursor: "pointer", fontSize: "20px" }} onClick={closeButton} title="Close Staff">X</p>
				</div>
				<Form onSubmit={onEditSubmit}>
					<FormGroup>
						<Label for="name"> Name</Label>
						<Input
							type="text"
							name="name"
							value={formData.name}
							onChange={onChangeHandler}
							placeholder=" Name"
							required

						/>
					</FormGroup>
					<FormGroup>
						<Label for="description"> Description</Label>
						<Input
							type="text"
							name="description"
							value={formData.description}
							onChange={onChangeHandler}
							placeholder="Description"
							required


						/>
					</FormGroup>
					<FormGroup>
						<Label for="price"> Price</Label>
						<Input
							type="number"
							name="price"
							value={formData.price}
							onChange={onChangeHandler}
							placeholder="Price"
							required

						/>
					</FormGroup>
					<div className={'text-center'}>
						{
							!submitLoader ? (
								<button type={'submit'} className={'table__btn px-4'}>EDIT</button>
							) : <Loader />
						}
					</div>
				</Form>
			</Modal.Body>
		</Modal>
	)








	let data = (
		<div className={'progress__bar'}>
			<Loader />
		</div>
	);


	if (packages && packages.length === 0) {
		data = <p className={'text-center'}>No Package Found</p>

	}

	if (packages && packages.length > 0) {
		data = (
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
							packages.map((i, index) => {
								return (
									(
										<TableRow hover key={index}>
											<TableCell> {i.name} </TableCell>
											<TableCell> {i.description} </TableCell>
											<TableCell> {i.price} </TableCell>
											{/*<TableCell>*/}
											{/*	<EditIcon style={{ cursor: "pointer" }} onClick={() => handleClose2(i)} />*/}
											{/*</TableCell>*/}
										</TableRow>
									)
								)
							})
						}
					</Fragment>
				</TableBody>
			</Table>
		)
	}

	const modalOpenHandler = () => {
		setAddShow(!addShow);
	}

	return (
		<div>
			{addModal}
			{editModal}
			<PageTitleBar title={<IntlMessages id="sidebar.customers" />} match={props.match} />
			<Row className={'justify-content-end'}>
				<Col md={2} sm={12} lg={1} className="mr-1">
					<button className={'text-center table__btn'}
					        onClick={modalOpenHandler}
					>Add</button>
				</Col>
			</Row>

			<div style={{ marginTop: '12px' }}>
				<RctCollapsibleCard heading="Customers list" fullBlock>
					<Tabs>
						<TabList>
							<Tab>All Packages</Tab>
						</TabList>
						<TabPanel>
							<div className="table-responsive">
								{
									data
								}
							</div>
						</TabPanel>
					</Tabs>
				</RctCollapsibleCard>
			</div>
		</div>
	);
}

export default Package;
