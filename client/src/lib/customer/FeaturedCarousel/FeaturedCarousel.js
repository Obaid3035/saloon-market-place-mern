import React from 'react';
import Slider from 'react-slick'
import "./FeaturedCarousel.css";
import RatingStar from "../RatingStar/RatingStar";
// import news3 from '../../../../assets/customer/img/news (3).png'
import { NavLink } from "react-router-dom";

const FeaturedCarousel = props => {

	console.log(props.featuredShops.length)

	// let slidesToShow = props.featuredShops.length;

	// if(props.featuredShops.length === 1) {
	// 	slidesToShow = 1
	// }
	// if(props.featuredShops.length === 2) {
	// 	slidesToShow = 2
	// }
	// if(props.featuredShops.length === 3) {
	// 	slidesToShow = 3
	// }
	// if(props.featuredShops.length === 4) {
	// 	slidesToShow = 4
	// }

	const settings = {
		dots: true,
		infinite: true,
		autoplaySpeed: 3000,
		arrows: true,
		autoplay: false,
		speed: 500,
		slidesToShow: 1,
		initialSlide: 0,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				}
			},
			{
				breakpoint: 767,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			},
			{
				breakpoint: 575,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			},
			{
				breakpoint: 400,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			},
			{
				breakpoint: 200,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
		]
	};

	return (
		<div>
			<Slider {...settings}>
				{
					props.featuredShops.map((shop, index) => (
						<div key={index} className={'main__slider mt-3'}>
							<div className={'wrapper1 position-relative'}>
								<img alt={'service1'} src={shop.shopImage.avatar} className={'img1'} id={'barber'} />
								<div className={'hover__text1 py-4 w-100 text-center'}>
									 <h3 onClick={()=> window.location.href= `/service/${shop._id}`}>  Visit Shop </h3>
								</div>
							</div>
						</div>
					))
				}
			</Slider>
		</div>
	);
};


export default FeaturedCarousel;
