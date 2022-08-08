import User from "../../model/user";
import { assert } from 'chai';
import supertest from 'supertest';
import app from "../../app";
import { user } from '../seed';


describe('User Controller', () => {
	it('should create a new user',  (done) => {
		supertest(app)
			.post('/v1/register')
			.send(user)
			.expect(201)
			.end((err, res) => {
				assert.equal(res.body.saved, true);
				done();
			})
	});

	it('should not create existing user', (done) => {
		User.create(user)
			.then(() => {
				supertest(app)
					.post('/v1/register')
					.send(user)
					.expect(401)
					.end((err, res) => {
						assert.equal(res.body.message, 'User already exist');
						done();
					})
			})
	});
	it('should authenticate a user', (done) => {
		User.create(user)
			.then(() => {
				supertest(app)
					.post('/v1/login')
					.send(user)
					.expect(200)
					.end((err, res) => {
						assert.equal(res.body.authenticate, true);
						done();
					})
			})
	});
	it('should not authenticate a user', (done) => {
		supertest(app)
			.post('/v1/login')
			.send(user)
			.expect(400)
			.end((err, res) => {
				assert.equal(res.body.message, 'Unable to login. Please registered yourself');
				done()
			})
	});
})