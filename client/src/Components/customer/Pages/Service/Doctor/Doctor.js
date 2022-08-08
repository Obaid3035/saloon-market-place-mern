import React, {useEffect, useState} from 'react';
import Service from "../Service";
import AboutImg from '../../../../../assets/customer/img/homepage-about-image.png';
import axios from "axios";

const Doctor = () => {
	const [shops, setShops] = useState(null);
	useEffect(() => {
		axios.get('/doctor-shop')
			.then((res) => {
				setShops(res.data);
			})
	}, [])
	const popularSearches = [
		'Lorem Ipsum',
		'Lorem Ipsum',
		'Lorem Ipsum',
		'Lorem Ipsum',
	]

	const props = {
		header__img: 'doctor__header__img',
		header__text: 'BOOK AN APPOINTMENT WITH A AESTHETIC DOCTOR ONLINE',
		card__text: 'Aesthetic doctor in Jumeirah Beach Residence',
		middle__text: 'Do you want a new Aesthetic doctor to enhance your face or a trendy hairstyle to go out? Whether for long health, the art of styling should be left to the professionals. For each makeover goal, there is a precise method that only seasoned hairdressers can implement. We have selected hairdressers for you in Paris, Bordeaux, Toulouse or even Lyon.',
		bottom__heading: 'here can I find a Aesthetic doctor for your health?',
		middle__img: 'doctor__middle__img',
		bottom__paragraph: 'Do you want a new Aesthetic doctor to enhance your face or a trendy hairstyle to go out? Whether for long health, the art of styling should be left to the professionals. For each makeover goal, there is a precise method that only seasoned hairdressers can implement. We have selected hairdressers for you in Paris, Bordeaux, Toulouse or even Lyon.',
		bottom_img: AboutImg,
		popularSearches,
		shops

	}
	return (
		<Service props={{...props}}/>
	);
};

export default Doctor;
