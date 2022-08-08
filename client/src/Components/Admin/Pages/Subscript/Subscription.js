import React, { Fragment, useEffect, useState } from 'react';
import PageTitleBar from "../../../../lib/vendor/PageTitleBar/PageTitleBar";
import IntlMessages from "../../../../Util/IntlMessages";
import axios from "axios";
import RctCollapsibleCard from "../../../../lib/vendor/RctCollapsibleCard/RctCollapsibleCard";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import ProgressBar from "../../../../lib/customer/ProgressBar/ProgressBar";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import "./subs.css";
import Loader from "../../../../lib/customer/Loader/Loader";
import moment from "moment";


const BookingVendor = props => {
    const columns = ['Vendor Email', 'Renew Date', 'Status'];




    const [allSubs, setAllSubs] = useState(null);
    const [paidSubs, setPaidSubs] = useState(null);
    const [unpaidSubs, setUnpaidSubs] = useState(null);
    const [loader, setLoader] = useState(false);


    useEffect(() => {
        setLoader(true);
        axios.get('/admin/subscription')
            .then((res) => {
                console.log(res.data)
                setAllSubs(res.data)
            })

        axios.get('/admin/subscription-paid')
            .then((res) => {
                // console.log(res.data)
                setPaidSubs(res.data)
            })

        axios.get('/admin/subscription-unpaid')
            .then((res) => {
                console.log(res.data)
                setUnpaidSubs(res.data)
            })
    }, [!loader])


    const renewTime = (expiryDate) => {
        const today = moment();
        const expiry = moment(expiryDate)
     return `${expiry.diff(today, 'days')} Days`
    }



    const subscriptionTable = (subscriptions) => {
        let subsTable = (
            <div className={'progress__bar'}>
                <Loader />
            </div>
        );
        if (subscriptions && subscriptions.length === 0) {
            subsTable = <p className={'text-center'}>No Subscription Found</p>

        }

        if (subscriptions && subscriptions.length > 0) {
            subsTable = (
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
                                subscriptions.map((subscribe, index) => {
                                    let all; let button;
                                    if (subscribe.subscriptionStatus === "PAID") {
                                        all = <TableCell key={index} className={'green__bg uppercase'}>   {subscribe.subscriptionStatus}  </TableCell>
                                    }
                                    else if (subscribe.subscriptionStatus === "UNPAID") {
                                        all = <TableCell key={index} className={'red__bg'}>   {subscribe.subscriptionStatus}   </TableCell>
                                    }
                                    return (
                                        (
                                            <TableRow hover key={index}>
                                                <TableCell> {subscribe.user.email} </TableCell>
                                                <TableCell> {subscribe.subscriptionStatus === 'PAID' ? renewTime(subscribe.expiryDate) : 'Free'} </TableCell>
                                                {all}
                                                {/*<TableCell>*/}
                                                {/*    <div className='d-flex'>*/}
                                                {/*        <div >*/}
                                                {/*            {*/}
                                                {/*                button*/}
                                                {/*            }*/}
                                                {/*        </div>*/}
                                                {/*    </div>*/}

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
        return subsTable;
    }


    return (
        <div>
            <PageTitleBar title={<IntlMessages id="sidebar.subscription" />} match={props.match} />

            <div style={{ marginTop: '12px' }}>
                <RctCollapsibleCard heading="Subscription list" fullBlock>
                    <Tabs>
                        <TabList>
                            <Tab>All Subscription</Tab>
                            <Tab>Paid Subscription</Tab>
                            <Tab>UnPaid Subscription</Tab>
                        </TabList>
                        <TabPanel>
                            <div className="table-responsive">
                                {
                                    subscriptionTable(allSubs)
                                }
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div className="table-responsive">
                                {
                                    subscriptionTable(paidSubs)
                                }
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div className="table-responsive">
                                {
                                    subscriptionTable(unpaidSubs)
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






