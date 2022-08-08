import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, Drawer, AppBar, Toolbar, Tooltip } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import screenfull from 'screenfull';
import MenuIcon from '@material-ui/icons/Menu';
import { connect } from "react-redux";
// actions
import { collapsedSidebarAction, vendorLogOut } from 'Store/vendor/actions';
import LanguageProvider from './LanguageProvider';
import SearchForm from './SearchForm';
import MobileSearchForm from './MobileSearchForm';
import * as action from "../../../Store/vendor/actions";

function Header(props) {
	const [customizer, setCustomizer] = useState(false);
	const [isMobileSearchFormVisible, setIsMobileSearchFormVisible] = useState(false);


	const logoutAdmin = () => {
		localStorage.removeItem("adminToken")
		window.location.href = "/"
	}

	const dispatch = useDispatch();
	const settings = useSelector(state => state.settings);

	// function to change the state of collapsed sidebar
	const onToggleNavCollapsed = (event) => {
		const val = settings.navCollapsed ? false : true;
		dispatch(collapsedSidebarAction(val));
	}


	// toggle screen full
	const toggleScreenFull = () => {
		screenfull.toggle();
	}

	// mobile search form
	const openMobileSearchForm = () => {
		setIsMobileSearchFormVisible(true);
	}

	return (
		<AppBar position="static" className="rct-header">
			<Toolbar className="d-flex justify-content-between w-100 pl-0">
				<div className="d-inline-flex align-items-center">
					<ul className="list-inline mb-0 navbar-left">
						<li className="list-inline-item" onClick={(e) => onToggleNavCollapsed(e)}>
							<Tooltip title="Sidebar Toggle" placement="bottom">
								<IconButton color="inherit" mini="true" aria-label="Menu" className="humburger p-0">
									<MenuIcon />
								</IconButton>
							</Tooltip>
						</li>
						<li className="list-inline-item search-icon d-inline-block">
							<SearchForm />
							<IconButton mini="true" className="search-icon-btn" onClick={() => openMobileSearchForm()}>
								<i className="zmdi zmdi-search" />
							</IconButton>
							<MobileSearchForm
								isOpen={isMobileSearchFormVisible}
								onClose={() => setIsMobileSearchFormVisible(false)}
							/>
						</li>
					</ul>
				</div>
				<ul className="navbar-right list-inline mb-0">
					<LanguageProvider />
					<li className="list-inline-item">
						<IconButton aria-label="settings" onClick={() => logoutAdmin()}>
							<i className="zmdi zmdi-power" />
						</IconButton>
					</li>
					<li className="list-inline-item">
						<Tooltip title="Full Screen" placement="bottom">
							<IconButton aria-label="settings" onClick={() => toggleScreenFull()}>
								<i className="zmdi zmdi-crop-free"></i>
							</IconButton>
						</Tooltip>
					</li>
				</ul>
			</Toolbar>
		</AppBar>
	);
}




export default Header
