import React, {useEffect} from 'react';
import {Card, Col, Container, Row} from "react-bootstrap";

const Booking = () => {
	useEffect(() => {
		window.scrollTo(0, 0)
	}, []);
	return (
		<>
			<div className={'checkout_section_1'}>
				<h3 className={'uppercase bold white text-center'}>your bookings</h3>
			</div>

			<Container className={'my-5'}>
				<Row className={'justify-content-center'}>
					<Col md={9}>
						<Card>
							<Card.Body>
								<hr/>
								<h4 className={'uppercase medium'} style={{color: '#D19A22'}}>Deluxe saloon</h4>
								<hr/>
								<Row className={'align-items-center'}>
									<Col md={8}>
										<Card className={'shadow-lg mt-4'}>
											<Card.Body>
												<h5>Semi-Permanent Colour & Finish</h5>
												<p className={'text-muted'}>1 hr 45 mints - 2hr</p>
												<p  style={{color: 'red'}}>Aed 100</p>
											</Card.Body>
										</Card>
										<Card className={'shadow-lg mt-4'}>
											<Card.Body>
												<h5>Semi-Permanent Colour & Finish</h5>
												<p className={'text-muted'}>1 hr 45 mints - 2hr</p>
												<p  style={{color: 'red'}}>Aed 100</p>
											</Card.Body>
										</Card>
									</Col>
									<Col md={4} className={'text-left'}>
										<div className={'d-flex'}>
											<i className="fas fa-calendar-week pr-3" />
											<p>June 15th, 2020</p>
										</div>
										<div className={'d-flex'}>
											<i className="far fa-clock pr-3" />
											<p>12:30 AM</p>
										</div>
										<div className={'d-flex'}>
											<i className="fas fa-map-marker-alt pr-3" />
											<p>Lahore</p>
										</div>
										<div className={'d-flex'}>
											<i className="fas fa-phone pr-3" />
											<p>090078601</p>
										</div>
									</Col>
								</Row>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default Booking;
