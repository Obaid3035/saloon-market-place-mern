import React from 'react';
import Slider from 'react-slick'
import "./carousel.css";
const Carousel = props => {

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
					props.images.map((image, index) => (
						<div key={index}>
							<img  className=" carousel-img img-fluid" alt="img" src={image.avatar} />
						</div>
					))
				}
			</Slider>

		</div>
	);
};

export default Carousel;

