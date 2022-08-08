import React from 'react';
import './ProgressBar.css';

const ProgressBar = (props) => {
			return (
				<div>
					<div className={props.shopRing}>
						<div />
						<div />
						<div />
						<div />
					</div>
					<div className={props.shopProgress}>
						<p> please wait </p>
					</div>
				</div>
			);

	}


export default ProgressBar;
