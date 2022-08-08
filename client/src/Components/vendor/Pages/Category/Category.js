
import React, { Fragment, useEffect, useState } from 'react';
import PageTitleBar from "../../../../lib/vendor/PageTitleBar/PageTitleBar";
import IntlMessages from "../../../../Util/IntlMessages";
import { Col, Modal, Row } from "react-bootstrap";
import RctCollapsibleCard from "../../../../lib/vendor/RctCollapsibleCard/RctCollapsibleCard";
import { Form, FormGroup, Input, Label } from "reactstrap";
import { Controller } from "react-hook-form";
import AsyncSelect from "react-select/async/dist/react-select.esm";
import ProgressBar from "../../../../lib/customer/ProgressBar/ProgressBar";
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { deleted, categoryAdded } from "../../../../Helpers/toastHelper";
import { confirmAlert } from "react-confirm-alert";
import { useToasts } from "react-toast-notifications";

import "./category.css";
import Loader from "../../../../lib/customer/Loader/Loader";

const Category = props => {
	const token = localStorage.getItem('vendorToken');
	const { addToast } = useToasts()
	const [submitLoader, setSubmitLoader] = useState(false);
	const [category, setCategory] = useState(null)


	useEffect(() => {
		axios.get('/vendor/shop-categories', { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				console.log(res.data)
				setCategory(res.data)
			})
	}, [submitLoader])
	const [categoryInput, setCategoryInput] = useState(null);
	const [show, setShow] = useState(false);
	const onAddCategory = (e) => {
		e.preventDefault();
		setSubmitLoader(true);
		axios.post('/vendor/staff-categories', { categories: categoryInput }, { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				console.log(res.data);
				setSubmitLoader(false);
				setShow(!show)
				categoryAdded(addToast)
			})
	}

	const onDeleteHandler = (category) => {
		const options = {
			title: 'Delete Category',
			message: 'Are you sure you want to delete ?',
			buttons: [
				{
					label: 'Confirm',
					onClick: () => {
						setSubmitLoader(true)
						axios.delete('/vendor/shop-categories', { headers: { "Authorization": `Bearer ${token}` } })
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
			overlayClassName: "overlay-custom-class-name"     // Custom overlay class name
		};
		confirmAlert(options);
	}

	const modal = (
		<Modal show={show} size={'lg'}>
			<Modal.Body>
				<div className="d-flex justify-content-between align-items-center">
					<p>Add Category</p>
					<p style={{ cursor: "pointer", fontSize: "20px" }} onClick={() => setShow(false)} title="Close Staff">X</p>
				</div>
				<Form onSubmit={onAddCategory}>
					<FormGroup>
						<Label for="name">Category</Label>
						<Input type="text" placeholder="Category" value={categoryInput} onChange={(e) => setCategoryInput(e.target.value)} required />
					</FormGroup>
					<div className={'text-center'}>
						{
							!submitLoader ? <button type={'submit'} className={'table__btn px-4 '}>Add</button>
								: <Loader />
						}
					</div>
				</Form>
			</Modal.Body>
		</Modal>
	)


	let categoryTable = (
		<div className={'progress__bar'}>
			<Loader />
		</div>)

	if (!submitLoader && category && category.length === 0) {
		categoryTable = <p className={'text-center'}>No Category Found</p>
	}

	if (!submitLoader && category && category.length > 0) {
		categoryTable = (
			<Table>
				<TableHead>
					<TableRow hover>
						{<>
							<TableCell>Category Name</TableCell>
							<TableCell>Actions</TableCell>
						</>
						}
					</TableRow>
				</TableHead>
				<TableBody>
					<Fragment>
						{
							category.map((service, index) => (
								<TableRow hover key={index}>
									<TableCell> {service} </TableCell>

									<TableCell>
										<IconButton className="text-danger px-2" aria-label="Delete" onClick={() => onDeleteHandler(service)}><i className="zmdi zmdi-delete" /></IconButton>
									</TableCell>
								</TableRow>
							))
						}
					</Fragment>
				</TableBody>
			</Table>
		)
	}


	return (
		<div>
			{modal}
			<PageTitleBar title={<IntlMessages id="sidebar.category" />} match={props.match} />
			<Row className={'justify-content-end'}>
				<Col sm={1}>
					<button className={'text-center table__btn'}
					        onClick={() => setShow(!show)}>Add</button>
				</Col>
			</Row>

			<div style={{ margin: '12px' }}>
				<Row className={'justify-content-center align-items-center'}>
					{categoryTable}
				</Row>
			</div>
		</div>
	);
};

export default Category;