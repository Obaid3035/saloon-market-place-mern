import React from 'react';
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import Brand from "../../../assets/customer/img/footer-logo.png";
import './Footer.css'

const Footer = () => {
	return (
		<>
			<footer className={'position-relative'}>
				<div className="footer-top">
					<Container>
						<Row>
							<Col md={6}>
								<img src={Brand} alt={'logo'} id={'brand'} className={'py-5'}/>
								<p className={'white footer__paragraph'}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. </p>
							</Col>
							<Col md={3} className={'d-flex flex-column justify-content-center'}>
								<p className={'white'}>Aesthetic Doctor</p>
								<p className={'white'}>Dentist</p>
								<p className={'white'}>Beautician</p>
							</Col>
							<Col md={3} className={'d-flex flex-column justify-content-center'}>
								<p className={'white'}>Hairdresser</p>
								<p className={'white'}>Barbers</p>
								<p className={'white'}>Spa</p>
							</Col>
						</Row>
					</Container>
				</div>
				<div>
					<Container>
						<p className={'text-left white mt-3'} style={{fontSize: '0.8rem'}}>© 2020. All rights reserved.</p>
					</Container>
				</div>
			</footer>
		</>
	);
};

export default Footer;
