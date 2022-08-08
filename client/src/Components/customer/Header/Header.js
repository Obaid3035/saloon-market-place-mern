import React from 'react';
import { Navbar, Container, Nav } from "react-bootstrap";
import Brand from '../../../assets/customer/img/header-logo.png';
import {Link, NavLink} from 'react-router-dom'
import * as action from '../../../Store/customer/actions/index';
import { connect } from "react-redux";
import "./Header.css";
import './Header.css'

const Header = props => {

	const isProfileSetup = localStorage.getItem('isProfileSetup');
	const adminToken = localStorage.getItem('adminToken');
	const vendorToken = localStorage.getItem('vendorToken');

	const shopLogout = ()=>{
		localStorage.removeItem("vendorToken")
		window.location.reload()
	}

	let create_shop;

	if (isProfileSetup === 'false' && props.isVendorAuth) {
		create_shop = (
			<>
				<NavLink to={'/create-shop'}><button className={'btn py-0 top__btn pt-1'}>Create Shop</button></NavLink>
				<button onClick={() => shopLogout()} className={'btn mx-4'}>Log Out</button>
			</>
		)
	}

	let authBtn;

	if (!adminToken && isProfileSetup && props.isVendorAuth === "false") {
		authBtn = (
			<>
				<NavLink to={'/login'}><button className={'btn'}>Customer Login/Register</button></NavLink>
			</>
		)
	}else if(!props.isVendorAuth && !adminToken){
		authBtn = (
			<>
				<NavLink to={'/login'}><button className={'btn'}>Customer Login/Register</button></NavLink>
			</>
		)
	}

	let vendorAuthBtnDash;


	if (!props.isAuth) {
		if (!props.isVendorAuth && !adminToken) {
			vendorAuthBtnDash = (
				<NavLink to={'/vendor/login'}><button className={'btn b-partner '}>Vendor Login/Register</button></NavLink>
			)
		} else if (adminToken) {
			vendorAuthBtnDash = (
				<button className={'btn mx-4 '} onClick={() => { window.location.href = "/admin/dashboard" }}>Go to admin dashboard</button>
			)
		}
		else if (isProfileSetup === 'true' && vendorToken) {
			console.log(isProfileSetup, vendorToken)
			vendorAuthBtnDash = (
				<button className={'btn mx-4'} onClick={() => {
					window.location.href = '/vendor/Dashboard'
				}}>Go to Dashboard</button>
			)
		}
	}


	if (props.isAuth) {
		authBtn = (
			<>
				<button onClick={() => props.logOut()} className={'btn mx-4'}>Log Out</button>
				<NavLink to={'/account'}><button className={'btn mx-4 '}>My Account</button></NavLink>
			</>

		)

	}

	return (
		<header>
			<div id={'nav-top'} className={'py-3 text-right'}>
				<Container>
					{create_shop}
					{vendorAuthBtnDash}
					{authBtn}
				</Container>
			</div>
			<Navbar bg="light" expand="lg" id={'site_nav'}>
				<NavLink to={'/'} className={'navbar-brand py-2'}><img src={Brand} alt={'logo'} id={'brand'} /></NavLink>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ml-auto">
						<li><a  className={'mx-2 nav-link'} href={'/result?shopName=&shopType=Aesthetic%20Doctor&latitude=0&longitude=0'}>Aesthetic doctor</a></li>
						<li><a className={'mx-2 nav-link'} href={'/result?shopName=&shopType=Smile%20Dentist&latitude=0&longitude=0'}>smile dentist</a></li>
						<li ><a className={'mx-2 nav-link'} href={'/result?shopName=&shopType=Beautician&latitude=0&longitude=0'}>beautician</a></li>
						{/*<NavLink to={'/hairdresser'} className={'mx-2 nav-link'}>hairdresser</NavLink>*/}
						<li><a className={'mx-2 nav-link'} href={'/result?shopName=&shopType=Barbers&latitude=0&longitude=0'}>barbers</a></li>
						{/*<NavLink to={'/spa'} className={'mx-2 nav-link'}>spa</NavLink>*/}
						<NavLink to={'/'} className={'mx-2 nav-link '}>
							<i className="fa fa-search" aria-hidden="true" />
						</NavLink>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		</header>
	);
};

const mapStateToProps = state => {
	return {
		isAuth: state.auth.isAuth,
		isVendorAuth: state.vendorAuth.isVendorAuth
	}
}

const mapDispatchToProps = dispatch => {
	return {
		logOut: () => dispatch(action.logOut())
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);

