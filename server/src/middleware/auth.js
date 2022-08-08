import jwt from 'jsonwebtoken'
import User from "../model/user";

const auth = async (req, res, next) => {
	try{
		const token = req.header('Authorization').replace('Bearer ', '');
		const decode = jwt.verify(token, 'secret');
		const user = await User.findById(decode._id)
		if (!user) {
			res.status(401).send({error: "Please Authorize Yourself"});
		}
		req.user = user;
		next();
	} catch (e) {
		console.log(e);
		res.status(401).send({error: "Authorize Yourself"});
	}
};

export default auth;