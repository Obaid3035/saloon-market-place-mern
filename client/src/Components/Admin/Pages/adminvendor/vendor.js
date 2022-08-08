import React, { Fragment, useEffect, useState } from 'react';
import PageTitleBar from "../../../../lib/vendor/PageTitleBar/PageTitleBar";
import IntlMessages from "../../../../Util/IntlMessages";
import axios from "axios";
import RctCollapsibleCard from "../../../../lib/vendor/RctCollapsibleCard/RctCollapsibleCard";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import BlockIcon from '@material-ui/icons/Block';
import StarIcon from '@material-ui/icons/Star';
import "./vendor.css";
import Loader from "../../../../lib/customer/Loader/Loader";


const BookingVendor = props => {
    const columns = ['Shop Name', 'Vendor Email', 'Shop Type', 'Shop Address', 'Status', 'Actions'];
    const [allVendors, setAllVendors] = useState(null);
    const [visibleVendors, setVisibleVendors] = useState(null);
    const [invisibleVendors, setInvisibleVendors] = useState(null);
    const [blockedVendors, setBlockedVendors] = useState(null);
    const [featuredVendors, setFeaturedVendors] = useState(null);
    const [loader, setLoader] = useState(false);


    useEffect(() => {
        setLoader(true);
        axios.get('/admin/vendors')
            .then((res) => {
                // console.log(res.data)
                setAllVendors(res.data)
            })

        axios.get('/admin/active-vendors')
            .then((res) => {
                // console.log(res.data)
                setVisibleVendors(res.data)
            })

        axios.get('/admin/active-inactive')
            .then((res) => {
                console.log(res.data)
                setInvisibleVendors(res.data)
            })
        axios.get('/admin/active-blocked')
            .then((res) => {
                setBlockedVendors(res.data)
            })
        axios.get('/admin/active-featured')
            .then((res) => {
                setFeaturedVendors(res.data)
            })
    }, [!loader])




    const VisiblibiltyHandler = (id) => {
        setLoader(false)
        axios.put('/admin/to-active/' + id)
            .then((res) => {
                setLoader(true)
                console.log(res.data)
            })
    }

    const InVisibiltyHandler = (id) => {
        setLoader(false)
        axios.put('/admin/to-inactive/' + id)
            .then((res) => {
                setLoader(true)
                console.log(res.data)
            })
    }

    const BlockedHandler = (id) => {
        setLoader(false)
        axios.put('/admin/to-blocked/' + id)
            .then((res) => {
                setLoader(true)
                console.log(res.data)
            })
    }

    const FeaturedHandler = (id) => {
        setLoader(false)
        axios.put('/admin/to-featured/' + id)
            .then((res) => {
                setLoader(true)
                console.log(res.data)
            })
    }

    const getvendorTable = (vendors) => {
        let vendorTable = (
            <div className={'progress__bar'}>
                <Loader />
            </div>
        );
        if (vendors && vendors.length === 0) {
            vendorTable = <p className={'text-center'}>No Vendors Found</p>

        }

        if (vendors && vendors.length > 0) {
            vendorTable = (
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
                                vendors.map((vendor, index) => {



                                    let shopName; let shopType; let shopAddress; let shopStatus; let id;
                                    if (vendor.shop) {
                                        shopName = vendor.shop.shopName
                                        shopType = vendor.shop.shopType
                                        shopAddress = vendor.shop.address
                                        shopStatus = vendor.shop.shopStatus
                                        id = vendor.shop._id
                                    }
                                    let all; let ico1; let ico2; let ico3;
                                    if (shopStatus === "active" || shopStatus === "Active" || shopStatus === "ACTIVE") {
                                        all = <TableCell style={{ fontWeight: "700" }} className={'green__bg uppercase'}>   {shopStatus}  </TableCell>
                                        ico1 = <VisibilityOffIcon style={{ cursor: "pointer" }} onClick={() => InVisibiltyHandler(id)} />
                                        ico2 = <BlockIcon style={{ cursor: "pointer" }} onClick={() => BlockedHandler(id)} />
                                        ico3 = <StarIcon style={{ cursor: "pointer" }} onClick={() => FeaturedHandler(id)} />
                                    }
                                    if (shopStatus === "blocked" || shopStatus === "Blocked" || shopStatus === "BLOCKED") {
                                        all = <TableCell style={{ fontWeight: "700" }} className={'red__bg uppercase'}>   {shopStatus}   </TableCell>
                                        ico1 = <VisibilityIcon style={{ cursor: "pointer" }} onClick={() => VisiblibiltyHandler(id)} />
                                        ico2 = <VisibilityOffIcon style={{ cursor: "pointer" }} onClick={() => InVisibiltyHandler(id)} />
                                    }
                                    if (shopStatus === "inActive" || shopStatus === "InActive" || shopStatus === "INACTIVE") {
                                        all = <TableCell style={{ fontWeight: "700" }} className={'yellow__bg uppercase'}>   {shopStatus}   </TableCell>
                                        ico1 = <VisibilityIcon style={{ cursor: "pointer" }} onClick={() => VisiblibiltyHandler(id)} />
                                        ico2 = <BlockIcon style={{ cursor: "pointer" }} onClick={() => BlockedHandler(id)} />
                                    }
                                    if (shopStatus === "featured" || shopStatus === "Featured" || shopStatus === "FEATURED") {
                                        all = <TableCell style={{ fontWeight: "700" }} className={'blue__bg uppercase'}>   {shopStatus}   </TableCell>
                                        ico1 = <VisibilityIcon style={{ cursor: "pointer" }} onClick={() => VisiblibiltyHandler(id)} />
                                        ico2 = <VisibilityOffIcon style={{ cursor: "pointer" }} onClick={() => InVisibiltyHandler(id)} />
                                        ico3 = <BlockIcon style={{ cursor: "pointer" }} onClick={() => BlockedHandler(id)} />
                                    }



                                    return (
                                        (
                                            <TableRow hover key={index}>
                                                <TableCell> {shopName} </TableCell>
                                                <TableCell> {vendor.email} </TableCell>
                                                <TableCell> {shopType} </TableCell>
                                                <TableCell> {shopAddress} </TableCell>
                                                {all}
                                                <TableCell>
                                                    <div className="d-flex">
                                                        <div className="mr-2">
                                                            {
                                                                ico1
                                                            }
                                                        </div>
                                                        <div className="mr-2">
                                                            {
                                                                ico2
                                                            }
                                                        </div>
                                                        <div>
                                                            {
                                                                ico3
                                                            }
                                                        </div>
                                                    </div>

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
        return vendorTable;

    }



    return (
        <div>
            <PageTitleBar title={<IntlMessages id="sidebar.vendor" />} match={props.match} />
            <div style={{ marginTop: '12px' }}>
                <RctCollapsibleCard heading="Vendor list" fullBlock>
                    <Tabs>
                        <TabList>
                            <Tab>All Vendors</Tab>
                            <Tab>Active Vendors</Tab>
                            <Tab>Inactive Vendors</Tab>
                            <Tab>Blocked Vendors</Tab>
                            <Tab>Featured Vendors</Tab>
                        </TabList>
                        <TabPanel>
                            <div className="table-responsive">
                                {
                                    getvendorTable(allVendors)
                                }
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div className="table-responsive">
                                {
                                    getvendorTable(visibleVendors)
                                }
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div className="table-responsive">
                                {
                                    getvendorTable(invisibleVendors)
                                }
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div className="table-responsive">
                                {
                                    getvendorTable(blockedVendors)
                                }
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div className="table-responsive">
                                {
                                    getvendorTable(featuredVendors)
                                }
                            </div>
                        </TabPanel>
                    </Tabs>
                </RctCollapsibleCard>
            </div>
        </div >


    );
}


export default BookingVendor;
