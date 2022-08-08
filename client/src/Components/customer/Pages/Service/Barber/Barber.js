import React, {useEffect, useState} from 'react';
import BarberImg from "../../../../../assets/customer/img/barber-image-3.png";
import Service from "../Service";
import axios from "axios";

const Barber = () => {
	const [barberShop, setBarberShop] = useState(null);
	useEffect(() => {
		axios.get('/barber-shop')
			.then((res) => {
				setBarberShop(res.data);
			})
	}, [])

	const popularSearches = [
		'Lorem Ipsum',
		'Lorem Ipsum',
		'Lorem Ipsum',
		'Lorem Ipsum',
	]

	const props = {
		header__img: 'barber__header__img',
		header__text: 'BOOK AN APPOINTMENT WITH A BARBER ONLINE',
		card__text: 'Aesthetic doctor in Jumeirah Beach Residence',
		middle__text: 'Do you want a new Aesthetic doctor to enhance your face or a trendy hairstyle to go out? Whether for long health, the art of styling should be left to the professionals. For each makeover goal, there is a precise method that only seasoned hairdressers can implement. We have selected hairdressers for you in Paris, Bordeaux, Toulouse or even Lyon.',
		bottom__heading: 'here can I find a barber for your hair?',
		middle__img: 'barber__middle__img',
		bottom__paragraph: 'Do you want a new Aesthetic doctor to enhance your face or a trendy hairstyle to go out? Whether for long health, the art of styling should be left to the professionals. For each makeover goal, there is a precise method that only seasoned hairdressers can implement. We have selected hairdressers for you in Paris, Bordeaux, Toulouse or even Lyon.',
		bottom_img: BarberImg,
		popularSearches,
		shops: barberShop
	}
	return (
		<Service props={{...props}}/>
	);
};

export default Barber;
