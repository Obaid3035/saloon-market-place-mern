import React, { useEffect, useState } from "react";
import { Card, Col, Container, Form, Row, Button } from "react-bootstrap";
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';

import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import NumberFormat from 'react-number-format';
import Loader from "../../lib/customer/Loader/Loader";
import "./Payment.css";


const Payment = () => {

	const [btnLoader, setBtnLoader] = useState(true);

	// const cardElement = elements.getElement(CardElement);

	let payment = (
		<div className={' subs__main text-center mt-5 mb-2'}>
			<h2>Payment </h2>
			<h4>your Card details</h4>
		</div>
	)

	const [checkoutDetail, setCheckoutDetail] = useState({
		customerName: '',
		zipCode: '',
	})


	const stripe = useStripe();
	const elements = useElements();

	const handleSubmit = async (event) => {
		// Block native form submission.
		event.preventDefault();
		setBtnLoader(false)
		if (!stripe || !elements) {
			setBtnLoader(true)
			// Stripe.js has not loaded yet. Make sure to disable
			// form submission until Stripe.js has loaded.
			return;
		}

		// Get a reference to a mounted CardElement. Elements knows how
		// to find your CardElement because there can only ever be one of
		// each type of element.
		const cardElement = elements.getElement(CardElement);

		// Use your card Element with other Stripe.js APIs
		const {error, paymentMethod} = await stripe.createPaymentMethod({
			type: 'card',
			card: cardElement,
		});



		if (error) {
			setBtnLoader(true)
			console.log('[error]', error);
		} else {
			console.log('[PaymentMethod]', paymentMethod);
			const res = await axios.post('/standard-subscribe', { 'payment_method': paymentMethod.id, checkoutDetail});

			const { status, clientSecret} = res.data;

			if (status === 'require_action') {
				stripe.confirmCardPayment(clientSecret).then((result) => {
					if(result.error) {
						setBtnLoader(true)
						console.log('There was an issue with your card');

						console.log(result.error.message);
					} else {
						setBtnLoader(true)
						console.log('Your card was successfully');
						// Successful subscription payment
					}
				});
			}
		}
	};


	let cardPayment = (
		<>
			<div className="row justify-content-center container-fluid">

				<div className="col-lg-7 col-md-7" >
					<Paper elevation={3} >
						<Form onSubmit={handleSubmit}>
							<div>
								<Row className={'mt-3 pt-3 justify-content-center'}>
									<Col md={7}>
										<i className="card-ico fab fa-cc-visa" />
										<i className="card-ico fab fa-cc-mastercard mx-2" />
									</Col>
									<Col md={3} >
										<p style={{ fontSize: "20px" }}>Amount: <span style={{ color: "red", fontWeight: "700" }}> $30.00</span></p>
									</Col>
								</Row>
								<Row className={'mt-3 pt-3 justify-content-center'}>
									<Col md={10}>
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
									</Col>
								</Row>
								<Row className={'mt-3 justify-content-center'}>
									<Col md={5} >
										<Form.Control name={'customerName'} value={checkoutDetail.customerName} onChange={(e) => setCheckoutDetail({...checkoutDetail, customerName: e.target.value})} placeholder={'FULL NAME'} className={'detail__form'} />
									</Col>
									<Col md={5}>
										<Form.Control name={'zipCode'} value={checkoutDetail.zipCode} onChange={(e) => setCheckoutDetail({...checkoutDetail, zipCode: e.target.value})} placeholder={'POSTAL / ZIP CODE'} className={'detail__form '} />
									</Col>
								</Row>

							</div>
							{
								btnLoader ? <button className={'justify-content-center payment-btn mt-3 btn btn-primary header__btn mb-5'} type={'submit'}>PAY NOW</button>
									: <Loader style={'text-center mt-5'}/>
							}

						</Form>
					</Paper>

				</div>

			</div>
		</>
	)





	return (
		<>
			{
				payment
			}
			{
				cardPayment
			}
		</>
	)
}

export default Payment;