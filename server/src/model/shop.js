import * as mongoose from "mongoose";
import StaffSchema from "./staff";
import Review from "./review";

const Schema = mongoose.Schema;


const geoSchema = new Schema({
	type: {
		type: String,
		default: 'Point'
	},
	coordinates: {
		type: [Number]
	}
});

const ShopSchema = new Schema({
		shopName: {
			type: String,
			required: true
		},
	shopStatus: {
		type: String,
		enum: ['ACTIVE', 'INACTIVE', 'BLOCKED', 'FEATURED'],
		required: true,
		default: 'INACTIVE'
	},
	shopType: {
			type: String,
			required: true
		},
	shopImage: { avatar: String, cloudinary_id: String},
	shopBannerImage: { avatar: String, cloudinary_id: String},
	gallery: [
			{ avatar: String, cloudinary_id: String},
		],
	description: {
			type: String,
			required: true
		},
	address: {
		type: String,
		required: true
	},
	location: {
		type: geoSchema,
		index: '2dsphere',
	},
	avgRating: {
			type: Number,
			required: true,
		default: 0
	},
	noOfReviews: {
		type: Number,
		required: true,
		default: 0
	},
	categories: [
		{
			type: String,
		}
	],
		schedule: {
			monday: {
				type: String,
			},
			tuesday: {
				type: String,
			},
			wednesday: {
				type: String,
			},
			thursday: {
				type: String,
			},
			friday: {
				type: String,
			},
			saturday: {
				type: String,
			},
			sunday: {
				type: String,
			},
		},
		staff: [
			StaffSchema
		],
		services: [
			{
				type: Schema.Types.ObjectId,
				ref: "service"
			}
		],
		reviews: [
			{
				type: Schema.Types.ObjectId,
				ref: "review"
			}
		],
	shopVisibility: {
			type: Boolean,
		required: true,
		default: false
	}
}, {
		timestamps: true
	}
);


const Shop = mongoose.model('shop', ShopSchema);

export default Shop;
