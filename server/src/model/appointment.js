import * as mongoose from "mongoose";
import moment from "moment";
import Shop from "./shop";

const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
		staffId: {
			type: String,
			required: true
		},
		title: {
			type: String,
			required: true
		},
	status: {
			type: String,
		enum: ['PENDING', 'COMPLETED', 'SUCCESSFUL', 'CANCELLED'],
		required: true,
		default: 'PENDING'
	},
		allDay: {
			type: Boolean,
			required: true,
			default: false
		},
		start: {
			type: Date,
			required: true
		},
		end: {
			type: Date,
			required: true
		},
		slot: {
			type: String,
			required: true
		},
		date: {
			type: String,
			required: true
		},
		customerName: {
			type: String,
			required: true
		},
	notes: {
		type: String,
	},
	services: [
		{
			type: Schema.Types.ObjectId,
			ref: "service",
			required: true
		}
	],
	totalPrice: {
		type: Number,
		required: true
	},
	shop: {
		type: Schema.Types.ObjectId,
		ref: "shop"
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "user",
		required: true
	}
	},
	{
		timestamps: true
	}
);

const timeToMilliseconds = (time) => {
	const [hours, mins] = time.split(":");
	const updateHours = new Date().setHours(hours);
	return new Date(updateHours).setMinutes(mins);
}

AppointmentSchema.statics.getSlots = async function(staffId, storeId, day=new Date()) {
	const date = moment(day).format('YYYY-MM-DD');
	const shop = await Shop.findById(storeId)
		.select('staff');
	const staffs = shop.staff;
	const staff = staffs.find(staff => {
		return staff._id.toString() === staffId.toString()
	});
	const slots = staff.slots[0].split(',')
	const appointments = await Appointment.find({
		staffId: staffId,
		date
	}, 'slot');

	let endIndex, startIndex;
	appointments.forEach((appointment) => {
		const startSlot = timeToMilliseconds(appointment.slot.slice(0,5));
		const endSlot = timeToMilliseconds(appointment.slot.slice(6,11))

		startIndex = slots.findIndex((i, index) => {
			if (timeToMilliseconds(slots[index]) === startSlot) {
				return i
			}
		})

		endIndex = slots.findIndex((i, index) => {
			if (endSlot <= timeToMilliseconds(slots[index])) {
				return i
			}
		});
		if (endIndex === -1) {
			endIndex = slots.length;
		}

		slots.splice(startIndex, endIndex  );
	})

	return slots;
}


const Appointment = mongoose.model('appointment', AppointmentSchema);

export default Appointment;