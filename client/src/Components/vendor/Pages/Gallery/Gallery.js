import React, { useEffect, useState } from 'react';
import axios from "axios";
import 'react-dropzone-component/styles/filepicker.css';
import 'dropzone/dist/min/dropzone.min.css'
import DropzoneComponent from 'react-dropzone-component';
import './Gallery.css';
import { Card, Col, Form, Row } from "react-bootstrap";
import Loader from "../../../../lib/customer/Loader/Loader";

const Gallery = () => {

	const [files, setFiles] = useState([]);
	const [message, setMessage] = useState('');
	const [mainLoader, setMainLoader] = useState(false);
	const [bannerLoader, setBannerLoader] = useState(false);
	const [galleryLoader, setGalleryLoader] = useState(false);

	const djsConfig = {
		addRemoveLinks: true,
		acceptedFiles: "image/jpeg,image/png,image/gif",
		autoProcessQueue: false
	};


	const componentConfig = {
		iconFiletypes: ['.jpg', '.png', '.gif'],
		showFiletypeIcon: true,
		postUrl: 'no-url'
	};


	// // Simple callbacks work too, of course
	const imgArr = [];
	const callback = (files) => {
		imgArr.push(files);
		console.log(imgArr)
		setFiles(imgArr);
	}

	const removedfile = file => {
		const selectedIndex = imgArr.findIndex((val, index) => {
			if (imgArr[index] === file) {
				return index
			}
			return false
		})
		const newArr = imgArr.splice(selectedIndex, 1)
		setFiles(newArr)
	};

	const eventHandlers = {
		addedfile: callback,
		removedfile: removedfile,
	}

	const token = localStorage.getItem('vendorToken');
	const [images, setImages] = useState(null);

	const [shopMainImage, setShopMainImage] = useState('');

	useEffect(() => {
		axios.get('/vendor/shop-images', { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				console.log(res.data)
				setImages(res.data)
			})
	}, [mainLoader, bannerLoader, galleryLoader])


	const onChange = (e) => {
		setShopMainImage(e.target.files[0])
	}

	const onSubmit = (e, whichImage) => {
		e.preventDefault();
		const formData = new FormData();
		if (whichImage === 'bannerImg') {
			setBannerLoader(true)
			formData.append('shopBannerImage', shopMainImage)
			axios.put('/vendor/banner-image', formData, { headers: { "Authorization": `Bearer ${token}` } })
				.then((res) => {
					setBannerLoader(false)
					console.log(res.data)
					setShopMainImage('');
				})
		}

		if (whichImage === 'mainImg') {
			setMainLoader(true)
			formData.append('shopImage', shopMainImage)
			axios.put('/vendor/main-image', formData, { headers: { "Authorization": `Bearer ${token}` } })
				.then((res) => {
					setMainLoader(false)
					console.log(res.data)
					setShopMainImage('');
				})
		}

		if (files.length > 0) {
			setGalleryLoader(true)
			if (whichImage === 'galleryImg') {
				for (const key of Object.keys(files)) {
					formData.append('gallery', files[key]);
				}
				axios.put('/vendor/gallery-image', formData, { headers: { "Authorization": `Bearer ${token}` } })
					.then((res) => {
						console.log(res.data)
						setGalleryLoader(false)
						setMessage('');
						setFiles([]);
					})
			}
		} else {
			setMessage('Please Upload an image')
		}
	}

	let gallery = (
		<div className={'progress__bar'}>
			<Loader />
		</div>
	)

	let mainImage = <Loader style={'text-center'} />
	let bannerImage = <Loader style={'text-center'} />

	if (!bannerLoader && images) {
		bannerImage = (
			<div className={'text-center'}>
				<img alt={'shopBanner'} className={'img-fluid p-4'} src={images.shopBannerImage.avatar} />
			</div>
		)
	}
	if (!mainLoader && images) {
		mainImage = (
			<div className={'text-left'}>
				<img alt={'shopMain'} id={'shop__main'} className={'img-fluid'} src={images.shopImage.avatar} />
			</div>
		)
	}

	console.log(shopMainImage)

	const onDelete = (img) => {
		setGalleryLoader(true)
		console.log(img)
		axios.put('/vendor/delete-image/' + img._id, { cloudinary_id: img.cloudinary_id },
			{ headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				setGalleryLoader(false)
				console.log(res.data);
			})
	}
	

	if (images) {
		gallery = (
			<>
				<Card>
					<Card.Header> 	<h2>Shop Banner Image</h2></Card.Header>
					<Card.Body>
						<Row>
							<Col md={12}>
								<Form onSubmit={(e) => onSubmit(e, 'bannerImg')} >
									<div className={'form-row align-items-center'}>
										<Col md={10}>
											<div className="input-group main__img_input">
												<div className="input-group-prepend">
													<span className="input-group-text">Shop Banner Image</span>
												</div>
												<div className="custom-file">
													<input type="file" required className="custom-file-input" id="inputGroupFile01" onChange={onChange} />
													<label className="custom-file-label" htmlFor="inputGroupFile01">{shopMainImage.name}</label>
												</div>
											</div>
										</Col>
										<Col md={2}>
											<div className={'text-center'}>
												<button type={'submit'} className={'text-center table__btn btn-block'}>Upload</button>
											</div>
										</Col>
									</div>

								</Form>
							</Col>
							<Col md={12}>
								{
									bannerImage
								}
							</Col>
						</Row>
					</Card.Body>
				</Card>

				<Card className={'my-4'}>
					<Card.Header> <h2>Shop Main Image</h2> </Card.Header>
					<Card.Body>
						<Row>

							<Col md={12}>
								<Form onSubmit={(e) => onSubmit(e, 'mainImg')} >
									<div className={'form-row align-items-center'}>
										<Col md={10}>
											<div className="input-group main__img_input">
												<div className="input-group-prepend">
													<span className="input-group-text">Shop Main Image</span>
												</div>
												<div className="custom-file">
													<input type="file" required className="custom-file-input" id="inputGroupFile01" onChange={onChange} />
													<label className="custom-file-label" htmlFor="inputGroupFile01">{shopMainImage.name}</label>
												</div>
											</div>

										</Col>
										<Col md={2}>
											{
												!galleryLoader ?
													<div className={'text-center'}>
														<button type={'submit'} className={'text-center table__btn btn-block'}>Upload</button>
													</div>
													: <Loader />
											}
										</Col>
									</div>

								</Form>
							</Col>
							<Col md={12}>
								{
									mainImage
								}
							</Col>
						</Row>
					</Card.Body>
				</Card>

				<Card className={'my-4'}>
					<Card.Header> <h2>Gallery</h2> </Card.Header>
					<Card.Body>
						<Row >

							<Col md={12}>
								<div className={'text-center'}>
									<p>{message}</p>
								</div>
								<div className={'form-row align-items-center my-4'}>
									<Col md={12}>
										<Form onSubmit={(e) => onSubmit(e, 'galleryImg')} >

											<DropzoneComponent
												config={componentConfig}
												eventHandlers={eventHandlers}
												djsConfig={djsConfig}
											/>
											{
												!galleryLoader ? <div className={'text-center'}>
													<button type={'submit'} className={'text-center table__btn mb-4'}>Upload</button>
												</div> : <Loader />
											}
										</Form>
									</Col>
								</div>
							</Col>

							{
								!galleryLoader ? images.gallery.map((img) => (
									<>
										<Col md={2}>
											<div className={'text-left'}>
												<i className="zmdi zmdi-close delete__img" onClick={() => onDelete(img)} />

												<img alt={'shopMain'} className={'img-fluid'} src={img.avatar} />
											</div>
										</Col>
									</>
								)) : null
							}
						</Row>
					</Card.Body>
				</Card>

			</>
		)
	}
	return (
		<div>
			{
				gallery
			}

		</div>
	);
};

export default Gallery;
