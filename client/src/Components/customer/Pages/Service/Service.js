import React from 'react';
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import SearchImg1 from '../../../../assets/customer/img/service_search_img.jpeg';
import lineImg from '../../../../assets/customer/img/line_img.png';
import './Service.css'
import RatingStar from "../../../../lib/customer/RatingStar/RatingStar";
import {NavLink} from "react-router-dom";
import Loader from "../../../../lib/customer/Loader/Loader";

const Service = ({props}) => {

	let shops = (
		<div className="text-center">
			<Loader style={'text-center mt-5'} />
		</div>
	)

	if (props.shops && props.shops.length === 0) {
		shops = (
			<div className={'text-center'}>
				<p className={'text-center'}>No Shop Found</p>
			</div>
		)
	}
	if (props.shops && props.shops.length > 0) {
		shops = props.shops.map((shop) => {
			return (
				<Col md={6} className={'mb-4'}>
					<div>
						<img  style={{width: "75%"}} alt={'news__img'} src={shop.shopImage.avatar} className={' img-fluid'} />
						<h4 className={' site__color uppercase pt-2 p-0 m-0'}>{shop.shopName}</h4>
						<RatingStar value={shop.avgRating} />
						<h5 className={'text-muted p-0 m-0 '}>{shop.address}</h5>
						<NavLink to={`/service/${shop._id}`} className={'uppercase btn btn-primary light service__btn'}>View Shop</NavLink>
					</div>
				</Col>
			)
		})
	}

	return (
		<>
			<div id={props.header__img} className={'section__header__img'}>
				<Container>
					<Row className={'justify-content-center'}>
						<Col md={8}>
							<h1 id={'service__heading'} className={'white text-center'}>
								{props.header__text}
							</h1>
						</Col>
					</Row>
				</Container>
			</div>

			<div id={'section__search'}>
				<Container>
					<Row />
					<Row className={'mt-5 justify-content-center'}>
						{ shops }
					</Row>

					<Row className={'pb-5'}>
						<Col md={12}>
							<p className={'service__text'}>{props.middle__text}</p>
						</Col>
					</Row>
				</Container>
			</div>

			<div id={props.middle__img} className={'section__discover'}>
				<Container>
					<Row className={'justify-content-center'}>
						<Col md={6} className={'text-center'}>
							<p className={'white uppercase'}>discover</p>
							<h3 className={'uppercase white'}>{props.bottom__heading}</h3>
							<img alt={'line__img'} src={lineImg} />
						</Col>
					</Row>
				</Container>
			</div>

			<div id={'section__bottom'}>
				<Container>
					<Row className={'justify-content-center mb-5'}>
						<Col md={8}>
							<Card id={'service__card'} className={'p-3'}>
								<Card.Body className={'text-muted'}>
									{props.bottom__paragraph}
								</Card.Body>
							</Card>
						</Col>
					</Row>
				</Container>
				<Container>
					<Row className={'mb-5'}>
						{/*<Col lg={6}>*/}
						{/*	<div className={'d-flex justify-content-around mt-5'}>*/}
						{/*			<ul className={'list-unstyled'}>*/}
						{/*				<li>Popular searches</li>*/}
						{/*				{props.popularSearches.map((text) => (*/}
						{/*					<li className={'light service__bottom__list'}>{text}</li>*/}
						{/*				))}*/}
						{/*			</ul>*/}
						{/*			<ul className={'list-unstyled mt-4'}>*/}
						{/*				{props.popularSearches.map((text) => (*/}
						{/*					<li className={'light service__bottom__list'}>{text}</li>*/}
						{/*				))}*/}
						{/*			</ul>*/}
						{/*	</div>*/}
						{/*</Col>*/}
						<div className={'offset-6'}>
							<img alt={'about__img'} src={props.bottom_img} className={'img-fluid'}/>
						</div>
					</Row>
				</Container>
			</div>
		</>
	);
};

export default Service;
