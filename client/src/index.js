import React from 'react';
import ReactDOM from 'react-dom';
import {configureStore} from "./Store";
import {Provider} from "react-redux";
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import axios from "axios";
import App from './MainApp';
import './index.css'
require('dotenv').config()


// axios.defaults.baseURL = 'http://192.168.50.12:4000/v1';
// axios.defaults.baseURL = 'http://localhost:4000/v1';
axios.defaults.baseURL = 'https://thiaza-backend.herokuapp.com/v1';

const stripePromise = loadStripe('pk_test_51JRZofGMszXYBJCxJbts2Vparu8oRVeM5z5oNlFNi7Kp3fcSQ4VnSJ6zKkSScxmMGCG2cWkAmCVdxE9ltUvhUTOH00YOCxrkBX');

const app = (
	<Elements stripe={stripePromise}>
		<Provider store={configureStore()}>
			<App />
		</Provider>
	</Elements>
)
ReactDOM.render(
      app,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

