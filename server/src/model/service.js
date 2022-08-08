import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

const ServiceSchema = new Schema({
	serviceName: {
		type: String,
		required: true
	},
	price: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	duration: {
		type: Number,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: "review"
		}
	]
})



const Service = mongoose.model('service', ServiceSchema);

export default Service;