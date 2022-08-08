import React, { Fragment, useEffect, useState } from 'react';
import PageTitleBar from "../../../../lib/vendor/PageTitleBar/PageTitleBar";
import IntlMessages from "../../../../Util/IntlMessages";
import axios from "axios";
import RctCollapsibleCard from "../../../../lib/vendor/RctCollapsibleCard/RctCollapsibleCard";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
// import './BookingVendor.css'
import { confirmAlert } from "react-confirm-alert";
import { getHoursDifference } from "../../../../Helpers/vendorHelpers";
import moment from "moment-timezone";
import ProgressBar from "../../../../lib/customer/ProgressBar/ProgressBar";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Loader from "../../../../lib/customer/Loader/Loader";


const AdminCustomers = props => {
    const columns = ['Email', 'Phone'];
    // const [appointments, setAppointments] = useState(null);


    const adminData = [
        {
            id: 1,
            Email: "hamza@mughal.com",
            phone: "9324554434",


        },
        {
            id: 2,
            Email: "hamza@mughal.com",
            phone: "9324554434",

        },
        {
            id: 3,
            Email: "hamza@mughal.com",
            phone: "9324554434",

        }
    ]

    const [allCustomer, setAllCustomer] = useState(null)

    useEffect(() => {
        axios.get('/admin/customers')
            .then((res) => {
                // console.log(res.data)
                setAllCustomer(res.data)
            })


    })


    // const getAppointmentTable = (appointments) => {
    // let appointmentTable = (
    // 	<div className={'progress__bar'}>
    // 		<ProgressBar shopProgress="appointmentProgress"
    // 		             shopRing="appointmentRing" />
    // 	</div>
    // );
    // if (appointments && appointments.length === 0) {
    // 	appointmentTable = <p className={'text-center'}>No Booking Found</p>

    // }

    // if (appointments && appointments.length > 0) {


    let data = (
        <div className={'progress__bar'}>
            <Loader />
        </div>
    );


    if (allCustomer && allCustomer.length === 0) {
        data = <p className={'text-center'}>No customers Found</p>

    }

    if (allCustomer && allCustomer.length > 0) {
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
                            allCustomer.map((customer, index) => {
                                return (
                                    (
                                        <TableRow hover key={index}>
                                            <TableCell> {customer.email} </TableCell>
                                            <TableCell> {customer.phoneNumber} </TableCell>
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

    return (
        <div>
            <PageTitleBar title={<IntlMessages id="sidebar.customers" />} match={props.match} />

            <div style={{ marginTop: '12px' }}>
                <RctCollapsibleCard heading="Customers list" fullBlock>
                    <Tabs>
                        <TabList>
                            <Tab>All Customers</Tab>

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

export default AdminCustomers;
