import React, { Fragment, useEffect, useState } from 'react';
import RctCollapsibleCard from "../../../../lib/vendor/RctCollapsibleCard/RctCollapsibleCard";
import './Review.css'
import { Table, TableBody, TableCell, TableHead, TableRow, Button } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import ProgressBar from "../../../../lib/customer/ProgressBar/ProgressBar";
import PageTitleBar from "../../../../lib/vendor/PageTitleBar/PageTitleBar";
import IntlMessages from "../../../../Util/IntlMessages";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import axios from "axios";
import { useToasts } from "react-toast-notifications";
import { visibleReview, hideReview } from "../../../../Helpers/toastHelper";
import Loader from "../../../../lib/customer/Loader/Loader";

const Review = props => {
	const columns = ['Customer Name', 'Comment', 'Rating', 'Status', "Actions"];
	const [reviews, setReviews] = useState(null);
	const [visibleReviews, setVisibleReviews] = useState([]);
	const [hiddenReviews, setHiddenReviews] = useState([]);
	const [loader, setLoader] = useState(false);

	const { addToast } = useToasts()

	const token = localStorage.getItem('vendorToken');

	useEffect(() => {
		setLoader(true);
		axios.get('/vendor/reviews', { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				console.log("reviews", res.data)
				setReviews(res.data)
			})

		axios.get('/vendor/visible-review', { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				console.log("visible", res.data)
				setVisibleReviews(res.data)
			})

		axios.get('/vendor/hidden-review', { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				console.log("hidden", res.data)
				setHiddenReviews(res.data)
			})
	}, [!loader])

	const toHidden = (hiddenId) => {
		setLoader(false)
		axios.put('/vendor/to-visible/' + hiddenId)
			.then((res) => {
				setLoader(true)
				console.log(res.data)
				visibleReview(addToast)
			})
	}

	const toVisible = (visibleId) => {
		setLoader(false)
		axios.put('/vendor/to-hidden/' + visibleId)
			.then((res) => {
				setLoader(true)
				console.log(res.data)
				hideReview(addToast)
			})
	}





	const getAppointmentTable = (reviews) => {
		let appointmentTable = (
			<div className={'progress__bar'}>
				<Loader/>
			</div>
		);
		if (reviews && reviews.length === 0) {
			appointmentTable = <p className={'text-center'}>No Reviews Found</p>
		}

		if (reviews && reviews.length > 0) {
			appointmentTable = (
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
								reviews.map((reviews, index) => {
									return (
										(
											<TableRow hover key={index}>
												<TableCell> {reviews.customerName} </TableCell>
												<TableCell> {reviews.comment} </TableCell>
												<TableCell> {[...Array(reviews.rating)].map(() => (
													<i className="zmdi zmdi-star-circle px-1" />
												))} </TableCell>
												<TableCell className={reviews.status === "VISIBLE" ? "text-success" : "text-danger"}> {reviews.status} </TableCell>
												<TableCell>
													{
														reviews.status === 'VISIBLE' ?
															<IconButton className="px-2" aria-label="Completed" onClick={() => toVisible(reviews._id)}><i className="zmdi zmdi-eye-off" />
															</IconButton> : null
													}
													{
														reviews.status === 'HIDDEN' ?
															<IconButton className=" px-2" aria-label="Pending" onClick={() => toHidden(reviews._id)}><i className="zmdi zmdi-eye" /></IconButton>
															: null
													}
												</TableCell>
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
		return appointmentTable;

	}

	return (
		<>
			<div className="data-table-wrapper">
				<PageTitleBar title={<IntlMessages id="sidebar.review" />} match={props.match} />
				<div style={{ marginTop: '12px' }}>
					<RctCollapsibleCard heading="Review list" fullBlock>
						<Tabs>
							<TabList>
								<Tab>All Reviews</Tab>
								<Tab>Visible Reviews</Tab>
								<Tab>Hidden Reviews</Tab>
							</TabList>
							<TabPanel>
								<div className="table-responsive">
									{
										getAppointmentTable(reviews)
									}
								</div>
							</TabPanel>
							<TabPanel>
								<div className="table-responsive">
									{
										getAppointmentTable(visibleReviews)
									}
								</div>
							</TabPanel>
							<TabPanel>
								<div className="table-responsive">
									{
										getAppointmentTable(hiddenReviews)
									}
								</div>
							</TabPanel>
						</Tabs>
					</RctCollapsibleCard>
				</div>
			</div>
		</>
	);
};

export default Review;


