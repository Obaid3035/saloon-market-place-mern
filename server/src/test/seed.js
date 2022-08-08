module.exports = {
	user: {
		email: 'obaid303@gmail.com',
		password: '12345678',
		phoneNumber: '+92 3112591703',
		role: 'CUSTOMER'
	},
	shop: {
		shopName: "Vella Barber Shop",
		shopType: "Salon",
		shopBannerImage: "http://localhost:3000/static/media/StoreBanner.250603c5.png",
		shopImage: "http://localhost:3000/static/media/homepage-about-image.f3b2639e.png",
		shopImages: [
			'http://localhost:3000/static/media/1.68d0b825.png',
			'http://localhost:3000/static/media/2.34f202c6.png',
			'http://localhost:3000/static/media/3.a4a15003.png'
		],
		contactNumber: "03112591703",

		tags: [
			"Hair Cut",
			"Hair Color",
			"Hair Styling",
			"Hair Wash",
			"Hair Removal"
		],
		description: "Growing up in Tucson, my fondest memories are the days spent with my father, going to the classic barber shops for a hair cut. I keenly remember the sights and smells of Nick’s Barbershop and the real experience of being a boy among men. It was a place that we could go together and do more than just get a hair cut. It was a place that made lasting memories.",
		address: "Gulistan-e-jauhar",
		schedule: {
			monday: {
				openingTime: Date.now(),
				closingTime: Date.now()
			},
			tuesday: {
				openingTime: Date.now(),
				closingTime: Date.now()
			},
			wednesday: {
				openingTime: Date.now(),
				closingTime: Date.now()
			},
			thursday: {
				openingTime: Date.now(),
				closingTime: Date.now()
			},
			friday: {
				openingTime: Date.now(),
				closingTime: Date.now()
			},
			saturday: {
				openingTime: Date.now(),
				closingTime: Date.now()
			},
			sunday: {
				openingTime: Date.now(),
				closingTime: Date.now()
			}
		},
	},
	service: {
		serviceName: "Face Massage",
		price: "200",
		category: "Facial",
		duration: 2.5,
		description: "Must Have Service Funny"
	}
}