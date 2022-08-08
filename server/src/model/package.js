import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

const PackageSchema = new Schema({
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true
		},
		price: {
			type: Number,
			required: true
		},
		productId: {
			type: String,
			required: true
		},
		priceId: {
			type: String,
			required: true
		},
	user: {
		type: Schema.Types.ObjectId,
		ref: "user",
		required: true
	},
	}, {
		timestamps: true
	}
);


const Package = mongoose.model('package', PackageSchema);

export default Package;
