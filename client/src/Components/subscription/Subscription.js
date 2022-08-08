import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import "./subscription.scss";
import axios from "axios";
import Loader from "../../lib/customer/Loader/Loader";
import { Col, Form, Modal, Row } from "react-bootstrap";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useToasts } from "react-toast-notifications";
import { cardAccepted, cardDeclined } from "../../Helpers/toastHelper";


const Subscription = props => {

    const [loader, setLoader] = useState(false);
    const [btnLoader, setBtnLoader] = useState(false);
    const [show, setShow] = useState(false);
    const stripe = useStripe();
    const elements = useElements();
    const { addToast } = useToasts()
    const [purchased, setPurchased] = useState(false);
    const [profileSetup, setProfileSetup] = useState(false);
    const [packages, setPackages] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState(null);

    const userId = props.match.params.id;
    const vendorToken = localStorage.getItem('vendorToken');

    useEffect(() => {
        const isProfileSetup = localStorage.getItem('isProfileSetup');
        if (isProfileSetup === 'true') {
            setProfileSetup(true)
        } else if (isProfileSetup === 'false') {
            setProfileSetup(false)
        }

        axios.get('/packages',)
            .then((res) => {
                res.data.push({
                    id: 1,
                    name: "FREE",
                    price: 0,
                    description: 'Lorem ipsum dolor sit amet,' +
                        ' consectetur adipiscing elit. Nulla sollicitudin massa vel',
                    button: "Get Started",
                    buttonClick: true,
                    paidUser: false
                });
                setPackages(res.data);
            })
    }, [])


    const handleSubmit = async (event) => {
        // Block native form submission.
        event.preventDefault();
        setBtnLoader(true)
        if (!stripe || !elements) {
            setBtnLoader(false)
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const cardElement = elements.getElement(CardElement);

        // Use your card Element with other Stripe.js APIs
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            setBtnLoader(false)
            console.log('[error]', error);
        } 
        else {
            const res = await axios.post('/standard-subscribe', { 'payment_method': paymentMethod.id, checkoutDetail, userId, priceId: selectedPackage.priceId },
                { headers: { "Authorization": `Bearer ${vendorToken}` } });

            const { status, clientSecret } = res.data;

            if (status === 'succeeded') {
                stripe.confirmCardPayment(clientSecret).then((result) => {
                    if (result.error) {
                        setBtnLoader(false)
                        cardDeclined(addToast)
                        console.log(result.error.message);
                    } else {
                        setPurchased(true)
                        const body = {
                            subscriptionStatus: 'PAID',
                            selectedPackageId: selectedPackage._id
                        }
                        axios.post('/vendor/subscription', body, { headers: { "Authorization": `Bearer ${vendorToken}` } })
                            .then((res) => {
                                localStorage.setItem('PAID', true);
                                if (profileSetup) {
                                    window.location.href = '/vendor/dashboard'
                                    setLoader(false);
                                } else {
                                    window.location.href = '/create-shop'
                                    setLoader(false);
                                }

                            })
                        // Successful subscription payment
                    }
                });
            }
        }
    };

    const [checkoutDetail, setCheckoutDetail] = useState({
        customerName: '',
        zipCode: '',
    })



    const onFreeSubscribeHandler = () => {
        setLoader(true);
        const body = {
            subscriptionStatus: 'UNPAID'
        }
        axios.post('/vendor/subscription', body, { headers: { "Authorization": `Bearer ${vendorToken}` } })
            .then((res) => {
                window.location.href = '/create-shop'
                setLoader(false);
            })
    }





    const openModalHandler = (myPackage) => {
        setShow(!show)
        setSelectedPackage(myPackage);
    }

    let offers = (
        <div className={' subs__main text-center mt-5'}>
            <h2>Offers</h2>
            <h3>{packages ? packages.length : 0} offers, for your simplicity:</h3>
        </div>
    )

    let card = (
        <div className="progress__bar">
            <Loader />;
        </div>
    )

    if (packages && packages.length > 0) {
        card = (
            <div className="container">
                <div className="row text-center d-flex justify-content-center align-items-ceneter">

                    {
                        packages.map((card) => {
                            let exampleBtn;
                            if (card.buttonClick) {
                                exampleBtn = <button className={'btn subs__btn'} onClick={onFreeSubscribeHandler}>{card.button}</button>
                            } else {
                                exampleBtn = <button className={'btn subs__btn'} onClick={() => openModalHandler(card)}  >Get Started</button>
                            }
                            return (
                                <div className="col-lg-3 col-md-4 col-sm-3half shadow mx-3 my-3 p-4 m-0">
                                    <div className={'my-5'}>
                                        <h3 className={'mt-5 mt-3'}>{card.name}</h3>
                                        <h1 className={'pb-5'} style={{ color: "red" }}>{card.price}</h1>
                                        <p className={'pb-2'}>{card.description}</p>
                                        {!loader ? exampleBtn : <Loader />}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

    let loaderCss = 'circle-loader'
    let display = 'none';

    if (purchased) {
        loaderCss = 'circle-loader load-complete'
        display = 'block';
    }


    const modal = (
        <Modal show={show} size={'md'} centered >
            <Modal.Header>
                <Modal.Title className={'uppercase bold'}>Payment</Modal.Title>
                <Modal.Title style={{ cursor: "pointer" }} className={'uppercase bold'} onClick={() => setShow(!show)} >X</Modal.Title>
            </Modal.Header>
            <Modal.Body className={'py-4'}>
                <Form onSubmit={handleSubmit}>
                    <Row className={'px-4 mb-4 justify-content-between align-items-center'}>
                        <div>
                            <i className="card-ico fab fa-cc-visa" />
                            <i className="card-ico fab fa-cc-mastercard mx-2" />
                        </div>
                        <div>
                            <p style={{ fontSize: "20px" }}>Amount: <span className={'d-block'} style={{ color: "red", fontWeight: "700" }}> $30.00</span></p>
                        </div>

                    </Row>
                    <div>
                        <CardElement
                            options={{
                                hidePostalCode: true,
                                style: {
                                    base: {
                                        fontSize: '20px',
                                        color: '#424770',
                                        '::placeholder': {
                                            color: '#aab7c4',
                                        },
                                    },
                                    invalid: {
                                        color: '#9e2146',
                                    },
                                },
                            }}
                        />
                        <Form.Control name={'customerName'} value={checkoutDetail.customerName} onChange={(e) => setCheckoutDetail({ ...checkoutDetail, customerName: e.target.value })} placeholder={'FULL NAME'} className={'detail__form mt-4'} />
                    </div>
                    {
                        !btnLoader ? <button className={'w-100 payment-btn mt-3 btn btn-primary header__btn mb-5'} type={'submit'}>PAY NOW</button>
                            : (
                                <div className={'text-center mt-4'}>
                                    <div className={loaderCss}>
                                        <div className="checkmark draw" style={{ display: display }} />
                                    </div>
                                </div>
                            )
                    }

                </Form>
            </Modal.Body>
        </Modal>
    )


    return (
        <>
            {
                modal
            }
            {
                offers
            }
            {
                card
            }
        </>
    )
}

export default Subscription


//<Loader style={'text-center mt-5'}/>
