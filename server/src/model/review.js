import * as mongoose from "mongoose";
import bcrypt from "bcrypt";
import Shop from "./shop";

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
	customerName: {
		type: String,
		required: true
	},
	rating: {
		type: Number,
		required: true
	},
	comment: {
		type: String,
		required: true
	},
	shop: {
			type: Schema.Types.ObjectId,
			ref: "shop"
	},
	status: {
		type: String,
		enum: ['VISIBLE', 'HIDDEN'],
		required: true,
		default: 'VISIBLE'
	}
},
	{
		timestamps: true
	}
);


ReviewSchema.pre("save", async function ( next ){
	const review = this;
	const reviews = await Review.find({ shop: review.shop});
	console.log(reviews.length)
	if (reviews.length === 0) {
		console.log('HELLO')
		await Shop.findByIdAndUpdate(review.shop, {
			avgRating: review.rating,
			noOfReviews: 0
		})
	} else  {
		const rating = [];
		reviews.forEach(( review ) => {
			rating.push(review.rating);
		})
		console.log(rating)
		const ratingSum = rating.reduce((acc, cur) => {
			return acc + cur
		}, 0)
		const avgRating = ratingSum / rating.length;
		await Shop.findByIdAndUpdate(review.shop, {
			avgRating: Math.round(avgRating),
			noOfReviews: rating.length
		})
	}
	next();
})


const Review = mongoose.model('review', ReviewSchema);

export default Review;