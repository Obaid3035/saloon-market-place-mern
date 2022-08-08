import React from 'react';
import SpaImg from '../../../../../assets/customer/img/spa-image-3.png';
import Service from "../Service";

const Spa = () => {
	const popularSearches = [
		'Lorem Ipsum',
		'Lorem Ipsum',
		'Lorem Ipsum',
		'Lorem Ipsum',
	]

	const props = {
		header__img: 'spa__header__img',
		header__text: 'BOOK AN APPOINTMENT WITH A SPA ONLINE',
		card__text: 'Aesthetic doctor in Jumeirah Beach Residence',
		middle__text: 'Do you want a new Aesthetic doctor to enhance your face or a trendy hairstyle to go out? Whether for long health, the art of styling should be left to the professionals. For each makeover goal, there is a precise method that only seasoned hairdressers can implement. We have selected hairdressers for you in Paris, Bordeaux, Toulouse or even Lyon.',
		bottom__heading: 'here can I find a spa for your body massage?',
		middle__img: 'spa_middle_img',
		bottom__paragraph: 'Do you want a new Aesthetic doctor to enhance your face or a trendy hairstyle to go out? Whether for long health, the art of styling should be left to the professionals. For each makeover goal, there is a precise method that only seasoned hairdressers can implement. We have selected hairdressers for you in Paris, Bordeaux, Toulouse or even Lyon.',
		bottom_img: SpaImg,
		popularSearches
	}
	return (
		<Service props={{...props}}/>
	);
};

export default Spa;
