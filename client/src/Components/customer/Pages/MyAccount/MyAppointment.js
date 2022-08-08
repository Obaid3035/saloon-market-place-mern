import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import "./Account.css";
import RatingStar from "../../../../lib/customer/RatingStar/RatingStar";
import ReactStars from "react-rating-stars-component";
import "./Account.css";
import { Button, Card, Col, Container, Modal, ModalBody, Row, Form } from "react-bootstrap";
import Loader from "../../../../lib/customer/Loader/Loader";
import { MdLocationOn } from "react-icons/md";



const Appointment = () => {

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const token = localStorage.getItem('token');
    const [booking, setBooking] = useState(null);
    const [service, setService] = useState('');
    const [starRating, setStarRating] = useState(1)
    const [comment, setComment] = useState("")



    useEffect(() => {
        axios.get('/pending-appointments', { headers: { "Authorization": `Bearer ${token}` } })
            .then((res) => {
                console.log("res name", res.data)
                setBooking(res.data);
            })
    }, [])

    const [show, setShow] = useState(false);
    // const [service, setService] = useState({})

    const handleClose = () => setShow(false);

    const handleShow = (service) => {
        setShow(true);
        setService(service);
    }

    const rating = (
        <>
            <div className={'rating d-flex justify-content-center'}>

                <RatingStar size={40} />

            </div>
        </>
    )


    const handleModalForm = (e) => {
        e.preventDefault()
        if (comment === "") {
            alert("must fill comment")
        }
        axios.post("", {
            "customerName": "pending",
            "rating": rating,
            "comment": comment
        })
    }



    const modal = (
        <Modal show={show} size={'lg'} id={'service__modal'}>
            <Modal.Header>
                <Modal.Title className={'uppercase white bold'}>Reviews</Modal.Title>
                <Modal.Title style={{ cursor: "pointer" }} className={'uppercase white bold'} onClick={handleClose} >x</Modal.Title>
            </Modal.Header>
            <ModalBody className={'px-5'}>
                <h4 className={'text-center'}>{service.name}</h4>
                <Row className={'mt-4'}>
                    <Col className={'appointment__model'}>
                        <h3 className={'text-center '}>Write a Review</h3>
                        <p className={'mt-5'}>overall Rating</p>

                    </Col>

                </Row>
                <Form onSubmit={handleModalForm}>
                    <div className="text-center d-flex justify-content-center">
                        <ReactStars
                            count={5}
                            value={starRating}
                            half={true}
                            size={24}
                            activeColor="#ffd700"
                            onChange={(val) => setStarRating(val)}
                        />
                    </div>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label className={'comment-head'} >COMMENTS</Form.Label>
                        <Form.Control as="textarea" rows={3} className={'comment'} value={comment} onChange={(e) => setComment(e.target.value)} />
                    </Form.Group>
                    <div className="text-center">
                        <Button type="submit" className="">Submit</Button>
                    </div>
                </Form>
            </ModalBody>
        </Modal>
    )


    let appointment = (
        <div className={'progress__bar'}>
            <Loader />
        </div>
    );

    if (booking && booking.length > 0) {

        appointment = (
            <>
                <div className="row justify-content-center">
                    {
                        booking.map((appointment) => {
                            const date = new Date(appointment.date)

                            return (
                                <>
                                    <div className="col-md-10">
                                        <Col className={'mt-3 shadow p-4'}>
                                            <Row>
                                                <Col md={4} className={'text-center hide-img-my-appoint'} >
                                                    <img alt={'shopImage'} src={appointment.shop.shopImage.avatar} className={'w-100 img-fluid'} />
                                                </Col>
                                                <Col md={8} className={'right__section p-4 d-lg-block d-md-none d-none'}>
                                                    <div className={'d-flex justify-content-between align-items-center'}>
                                                        <div>
                                                            <h3 style={{ fontWeight: "bold" }} className="pb-2">{appointment.shop.shopName}</h3>
                                                            <div className="d-flex align-items-center p-0 m-0">
                                                                <MdLocationOn color={"grey"} size={20} />
                                                                <p style={{ fontSize: "16px", color: "grey", textDecoration: "underline" }} className="p-0 m-0">{appointment.shop.address}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className={'mt-4'}>
                                                            <p style={{ fontSize: "14px" }}>Appointment on <span style={{ color: "grey" }}>{dayOfWeek[date.getDay()]} at {date.getDate()} {monthNames[date.getMonth()]}</span></p>
                                                        </div>
                                                        <div>
                                                            <h6 className="font-weight-bold">Aed <span>{appointment.totalPrice}</span></h6>
                                                        </div>
                                                        <div>
                                                            <div className="d-flex ">
                                                                <h5 style={{ fontWeight: "bolder" }} className="mr-3" >{appointment.slot}</h5>
                                                                <h5>{monthNames[date.getMonth()]} {date.getDate()} {dayOfWeek[date.getDay()]}</h5>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>

                                                <Col md={8} className={'right__section p-4 d-lg-none d-md-block d-none'}>
                                                    <div className={'d-flex justify-content-between align-items-center'}>
                                                        <div>
                                                            <h3 style={{ fontWeight: "bold" }} className="pb-2">{appointment.shop.shopName}</h3>
                                                            <div className="d-flex align-items-center p-0 m-0">
                                                                <MdLocationOn color={"grey"} size={20} />
                                                                <p style={{ fontSize: "16px", color: "grey", textDecoration: "underline" }} className="p-0 m-0">{appointment.shop.address}</p>
                                                            </div>
                                                        </div>
                                                        <h3 style={{ fontWeight: "bolder" }} className="pt-2">{appointment.slot}</h3>
                                                        <div>
                                                            <h5 className="pb-2">{monthNames[date.getMonth()]} {date.getDate()}</h5>
                                                            <h5>{dayOfWeek[date.getDay()]}</h5>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className={'mt-4'}>
                                                            <p style={{ fontSize: "14px" }}>Appointment on <span style={{ color: "grey" }}>{dayOfWeek[date.getDay()]} at {date.getDate()} {monthNames[date.getMonth()]} - {appointment.totalPrice}(Aed)</span></p>
                                                        </div>
                                                        <div>
                                                            <h6 className="font-weight-bold">Aed <span>{appointment.totalPrice}</span></h6>
                                                        </div>
                                                    </div>
                                                </Col>

                                                <Col md={8} className={'right__section d-lg-none d-md-none d-block m-0 p-0'} style={{ borderRadius: "5px" }}>
                                                    <div style={{ background: "black", borderTopLeftRadius: "5px", borderTopRightRadius: "5px" }}>
                                                        <p style={{ color: "#fff" }} className="p-3 text-center">{dayOfWeek[date.getDay()]} {date.getDate()} {monthNames[date.getMonth()]}</p>
                                                    </div>
                                                    <div className="ml-2">
                                                        <h1 style={{ fontWeight: "bold" }} className="pb-2">{appointment.shop.shopName}</h1>
                                                    </div>
                                                    <div className="ml-1 d-flex align-items-center p-0 m-0">
                                                        <MdLocationOn color={"grey"} size={20} />
                                                        <p style={{ fontSize: "16px", color: "grey", textDecoration: "underline" }} className="p-0 m-0">{appointment.shop.address}</p>
                                                    </div>
                                                    <div className="ml-2 mt-4">
                                                        <h6 className="font-weight-bold mt-2">Aed <span>{appointment.totalPrice}</span></h6>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </div>
                                </>
                            )
                        })
                    }
                </div>

            </>
        );
    }

    if (booking && booking.length === 0) {
        appointment = (
            <>
                <div>
                    {modal}
                    <div className="container appointment">
                        <div className="pt-5">
                            <p className="card-text">My appointments</p>
                            <div className="card w-100">
                                <div className="card-body">
                                    <p className="card-text">You haven't made an appointment yet</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <div className={'appointment__section'}>
                {appointment}
            </div>
        </>
    )

}


export default Appointment