import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

const ImgSchema = new Schema({
	img: { data: Buffer, contentType: String}
}, {
	timestamps: true
});

const Img = mongoose.model('img', ImgSchema);

export default Img;