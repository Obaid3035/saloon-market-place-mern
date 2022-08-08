import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "user",
		required: true
	},
	expiryDate: {
		type: Date,
	},
	subscriptionStatus: {
		type: String,
		enum: ['PAID', 'UNPAID'],
		required: true
	},
	package: {
		type: Schema.Types.ObjectId,
		ref: "package",
	},
}, {
	timestamps: true
	}
);


const Subscription = mongoose.model('subscription', SubscriptionSchema);

export default Subscription;
