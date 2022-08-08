/**
 * Booking Info Widget
 */
import React, { useEffect, useState } from 'react';
import { Card, CardTitle } from 'reactstrap';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import axios from "axios"
// intl messages
import IntlMessages from 'Util/IntlMessages';

const BookingInfo = () => {

    const [todayCompleted, setTodayCompleted] = useState(0);
    const [todayPending, setTodayPending] = useState(0);
    const [todayCancel, setTodayCancel] = useState(0);
    const token = localStorage.getItem('vendorToken');
    useEffect(() => {
        axios.get('/vendor/count-appointments', { headers: { "Authorization": `Bearer ${token}` } })
            .then((res) => {
                console.log(res.data)
                setTodayCompleted(res.data.completedAppointments)
                setTodayPending(res.data.pendingAppointments)
                setTodayCancel(res.data.cancelledAppointments)
            })
    }, [])



    return (
        <Card className="rct-block">
            <List className="p-0 fs-14">
                <ListItem className="d-flex justify-content-between border-bottom  align-items-center p-15">
                    <span>
                        <i className="material-icons mr-25 fs-14 text-primary">add_to_photos</i>
                        Completed
                    </span>
                    <span>{todayCompleted}</span>
                </ListItem>
                <ListItem className="d-flex justify-content-between align-items-center border-bottom p-15">
                    <span>
                        <i className="material-icons mr-25 text-success fs-14">check_box</i>
                        Cancelled
                    </span>
                    <span>{todayCancel}</span>
                </ListItem>
                <ListItem className="d-flex justify-content-between align-items-center p-15">
                    <span>
                        <i className="material-icons mr-25 text-danger fs-14">access_time</i>
                        <IntlMessages id="widgets.pending" />
                    </span>
                    <span>{todayPending}</span>
                </ListItem>
            </List>
        </Card>
    );
}

export default BookingInfo;