import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import moment from "moment-timezone";

import handleErrors from "./middleware/handleError";
import router from "./config/routes";


const app = express();

app.use(cors({ origin: true }));
moment.tz.setDefault("Asia/Dubai");
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", '*');
	res.header("Access-Control-Allow-Credentials", true);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
	next();
});
//

//process.env.MONGODB_URL || uri
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// secret_admin123
//LOCAL
//'mongodb://localhost/thiaza'
//process.env.MONGODB_URL || uri
// mongodb+srv://obaid3035:secret_admin123@thiaza.mcih9.mongodb.net/test

const uri = "mongodb+srv://obaid3035:secret_admin123@thiaza.mcih9.mongodb.net/thiaza?retryWrites=true&w=majority";
if (process.env.NODE_ENV !== 'test') {
	mongoose.Promise = global.Promise;
	mongoose.connect(process.env.MONGODB_URL || uri,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
}

app.use('/v1',router);
app.use(handleErrors);
export default app;

//TO FIND PID: lsof -i tcp:4000
//
