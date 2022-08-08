import { assert } from 'chai';
import supertest from 'supertest';
import app from "../../../app";
import { shop } from '../../seed';
import Shop from "../../../model/shop";

describe('Shop Controller', () => {
	it('should create a new shop', (done) => {
		supertest(app)
			.post('/v1/shop')
			.send(shop)
			.expect(201)
			.end((err, res) => {
				// var time = Date.now();
				// var formatted = moment.tz(time, 'Asia/Dubai')
				// console.log(formatted.format('hh:mm'))
				assert.equal(res.body.saved, true);
				done();
			})
	});

	it('should get all shops', (done) => {
		Shop.create(shop)
			.then(() => {
				supertest(app)
					.get('/v1/shops')
					.expect(200)
					.end((err, res) => {
						assert.equal(res.body.length, 1)
						done();
					})
			})
	});
	it('should get single shops',  (done) => {
		Shop.create(shop)
			.then((res) => {
				supertest(app)
					.get('/v1/shop/'+res._id)
					.expect(200)
					.end((err, response) => {
						assert.equal(response.body._id, res._id);
						done();
					})
			})
	});
})
