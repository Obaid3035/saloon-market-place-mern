import { assert } from 'chai';
import supertest from 'supertest';
import app from "../../../app";
import { service } from '../../seed';
import Service from "../../../model/service";


describe('Service Controller', () => {
	it('should create a new service', (done) => {
		supertest(app)
			.post('/v1/vendor/service')
			.send(service)
			.expect(201)
			.end((err, res) => {
				assert.equal(res.body.saved, true);
				done();
			})
	});

	it('should get all services', (done) => {
		Service.create(service)
			.then(() => {
				supertest(app)
					.get('/v1/vendor/service')
					.send(service)
					.expect(200)
					.end((err, res) => {
						assert.equal(res.body.length, 1);
						done();
					})
			})
	});
	it('should edit existing service', (done) => {
		Service.create(service)
			.then((res) => {
				supertest(app)
					.put('/v1/vendor/service/' + res._id)
					.send(service)
					.end((err, res) => {
						assert.equal(res.body.updated, true);
						done();
					})
			})
	});
	it('should delete existing service', (done) => {
		Service.create(service)
			.then((res) => {
				supertest(app)
					.delete('/v1/vendor/service/' + res._id)
					.send(service)
					.end((err, res) => {
						assert.equal(res.body.deleted, true);
						done();
					})
			})
		}
	);
})