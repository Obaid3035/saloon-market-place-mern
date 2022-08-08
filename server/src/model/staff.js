import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

const StaffSchema = new Schema({
	staffName: {
		type: String,
		required: true
	},
	visibility: {
		type: Boolean,
		required: true
	},
	availabilityDays: [
		{
			type: Number,
			required: true
		}
	],
	profilePicture: { avatar: String, cloudinary_id: String},
	interval: {
		type: String,
		required: true
	},
	slots: {
		type: Array,
		required: true
	},
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
	]
});


export default StaffSchema;