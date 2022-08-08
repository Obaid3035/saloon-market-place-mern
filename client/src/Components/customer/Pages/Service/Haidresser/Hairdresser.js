import React from 'react';
import AboutImg from '../../../../../assets/customer/img/homepage-about-image.png';
import Service from "../Service";

const Hairdresser = () => {
	const popularSearches = [
		'Lorem Ipsum',
		'Lorem Ipsum',
		'Lorem Ipsum',
		'Lorem Ipsum',
	]

	const props = {
		header__img: 'barber__header__img',
		header__text: 'BOOK AN APPOINTMENT WITH A HAIRDRESSER ONLINE',
		card__text: 'Aesthetic doctor in Jumeirah Beach Residence',
		middle__text: 'Do you want a new Aesthetic doctor to enhance your face or a trendy hairstyle to go out? Whether for long health, the art of styling should be left to the professionals. For each makeover goal, there is a precise method that only seasoned hairdressers can implement. We have selected hairdressers for you in Paris, Bordeaux, Toulouse or even Lyon.',
		bottom__heading: 'here can I find a hairdressers for your hair?',
		middle__img: 'barber__middle__img',
		bottom__paragraph: 'Do you want a new Aesthetic doctor to enhance your face or a trendy hairstyle to go out? Whether for long health, the art of styling should be left to the professionals. For each makeover goal, there is a precise method that only seasoned hairdressers can implement. We have selected hairdressers for you in Paris, Bordeaux, Toulouse or even Lyon.',
		bottom_img: AboutImg,
		popularSearches
	}
	return (
		<Service props={{...props}}/>
	);
};

export default Hairdresser;
