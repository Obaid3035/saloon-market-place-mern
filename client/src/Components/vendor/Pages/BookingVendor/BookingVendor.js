import React, { Fragment, useEffect, useState } from 'react';
import PageTitleBar from "../../../../lib/vendor/PageTitleBar/PageTitleBar";
import IntlMessages from "../../../../Util/IntlMessages";
import axios from "axios";
import RctCollapsibleCard from "../../../../lib/vendor/RctCollapsibleCard/RctCollapsibleCard";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import './BookingVendor.css'
import { getHoursDifference } from "../../../../Helpers/vendorHelpers";
import moment from "moment-timezone";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useToasts } from "react-toast-notifications";
import { completedAppointment, pendingAppointment, cancalledAppointment } from "../../../../Helpers/toastHelper";
import Loader from "../../../../lib/customer/Loader/Loader";


const BookingVendor = props => {
	const columns = ['Customer Name', 'Customer Email', 'Customer Contact', 'Employee', 'Slot', 'Date', 'Duration', 'Status', 'Actions'];
	const [appointments, setAppointments] = useState(null);
	const [cancelledAppointments, setCancelledAppointments] = useState([]);
	const [pendingAppointments, setPendingAppointments] = useState([]);
	const [completedAppointments, setCompletedAppointments] = useState([]);
	const [loader, setLoader] = useState(false);

	const { addToast } = useToasts()

	const token = localStorage.getItem('vendorToken');

	useEffect(() => {
		setLoader(true);
		axios.get('/vendor/appointments', { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				console.log(res.data)
				setAppointments(res.data)
			})

		axios.get('/vendor/appointments-pending', { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				setPendingAppointments(res.data)
			})

		axios.get('/vendor/appointments-completed', { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				setCompletedAppointments(res.data)
			})
		axios.get('/vendor/appointments-cancelled', { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				setCancelledAppointments(res.data)
			})
	}, [!loader])



	// const onDeleteHandler = (appointmentId) => {
	// 	const options = {
	// 		title: 'Delete Booking',
	// 		message: 'Are you sure you want to delete ?',
	// 		buttons: [
	// 			{
	// 				label: 'Confirm',
	// 				onClick: () => alert(appointmentId)
	// 			},
	// 			{
	// 				label: 'Cancel',
	// 				onClick: () => alert('Click No')
	// 			}
	// 		],
	// 		childrenElement: () => <div />,
	// 		closeOnEscape: true,
	// 		closeOnClickOutside: true,
	// 		overlayClassName: "overlay-custom-class-name"     // Custom overlay class name
	// 	};
	// 	confirmAlert(options);
	// }

	const onCompleteAppointmentHandler = (appointmentId) => {
		setLoader(false)
		axios.put('/vendor/appointment-complete/' + appointmentId)
			.then((res) => {
				setLoader(true)
				console.log(res.data)
				completedAppointment(addToast)
			})
	}

	const onPendingAppointmentHandler = (appointmentId) => {
		setLoader(false)
		axios.put('/vendor/appointment-pending/' + appointmentId)
			.then((res) => {
				setLoader(true)
				console.log(res.data)
				pendingAppointment(addToast)
			})
	}

	const onCancelledAppointments = (appointmentId) => {
		setLoader(false)
		axios.put('/vendor/appointment-cancelled/' + appointmentId)
			.then((res) => {
				setLoader(true)
				console.log(res.data)
				cancalledAppointment(addToast)
			})
	}



	const getAppointmentTable = (appointments) => {
		let appointmentTable = (
			<div className={'progress__bar'}>
				<Loader />
			</div>
		);
		if (appointments && appointments.length === 0) {
			appointmentTable = <p className={'text-center'}>No Booking Found</p>

		}

		if (appointments && appointments.length > 0) {
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
								appointments.map((appointment, index) => {
									let cell;
									if (appointment.status === 'COMPLETED') {
										cell = <TableCell className={'green__bg'}>{appointment.status}</TableCell>
									}
									if (appointment.status === 'PENDING') {
										cell = <TableCell className={'yellow__bg'}>{appointment.status}</TableCell>
									}
									if (appointment.status === 'CANCELLED') {
										cell = <TableCell className={'red__bg'}>{appointment.status}</TableCell>
									}
									return (
										(
											<TableRow hover key={index}>
												<TableCell> {appointment.customerName} </TableCell>
												<TableCell> {appointment.user.email} </TableCell>
												<TableCell> {appointment.user.phoneNumber} </TableCell>
												<TableCell> {appointment.title} </TableCell>
												<TableCell>{appointment.slot}</TableCell>
												<TableCell>{moment(appointment.start).format('YYYY-MM-DD')}</TableCell>
												<TableCell>{getHoursDifference(appointment.start, appointment.end)}</TableCell>
												{cell}
												<TableCell>
													{
														appointment.status === 'CANCELLED' || appointment.status === 'PENDING' ?
															<IconButton className="text-success px-2" aria-label="Completed" onClick={() => onCompleteAppointmentHandler(appointment._id)}><i className="zmdi zmdi-check" />
															</IconButton> : null
													}
													{
														appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED' ?
															<IconButton className="text-warning px-2" aria-label="Pending" onClick={() => onPendingAppointmentHandler(appointment._id)}><i className="zmdi zmdi-time-interval" /></IconButton>
															: null
													}
													{
														appointment.status === 'PENDING' || appointment.status === 'COMPLETED' ? <IconButton className="text-danger px-2" aria-label="Delete" onClick={() => onCancelledAppointments(appointment._id)}><i className="zmdi zmdi-close" /></IconButton>
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
		<div>
			<PageTitleBar title={<IntlMessages id="sidebar.onlinebooking" />} match={props.match} />

			<div style={{ marginTop: '12px' }}>
				<RctCollapsibleCard heading="Booking list" fullBlock>
					<Tabs>
						<TabList>
							<Tab>All Appointments</Tab>
							<Tab>Pending Appointments</Tab>
							<Tab>Cancelled Appointments</Tab>
							<Tab>Completed Appointments</Tab>
						</TabList>
						<TabPanel>
							<div className="table-responsive">
								{
									getAppointmentTable(appointments)
								}
							</div>
						</TabPanel>
						<TabPanel>
							<div className="table-responsive">
								{
									getAppointmentTable(pendingAppointments)
								}
							</div>
						</TabPanel>
						<TabPanel>
							<div className="table-responsive">
								{
									getAppointmentTable(cancelledAppointments)
								}
							</div>
						</TabPanel>
						<TabPanel>
							<div className="table-responsive">
								{
									getAppointmentTable(completedAppointments)
								}
							</div>
						</TabPanel>
					</Tabs>
				</RctCollapsibleCard>
			</div>
		</div>
	);
}

export default BookingVendor;