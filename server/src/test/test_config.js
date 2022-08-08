import mongoose from "mongoose";

before(done => {
	mongoose.connect('mongodb://localhost/thiaza-test')
	mongoose.connection
		.once('open', () => done())
		.on('error', (err) => {
			console.warn('WARNING', err);
		})
})

beforeEach(done => {
	const { users }  = mongoose.connection.collections;
	users.drop()
		.then(() => done())
		.catch(() => done());

})

beforeEach(done => {
	const { shops }  = mongoose.connection.collections;
	shops.drop()
		.then(() => done())
		.catch(() => done());
})

beforeEach(done => {
	const { services }  = mongoose.connection.collections;
	services.drop()
		.then(() => done())
		.catch(() => done());
})
