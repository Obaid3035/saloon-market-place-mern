import multer from 'multer';



const storageEngine = multer.diskStorage ({});

const fileFilter = (req, file, callback) => {

	if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
		// upload only png and jpg format
		return callback(new Error('Please upload a Image'))
	}
	callback(undefined, true)
};

const upload = multer ({
	storage: storageEngine,
	fileFilter
});

export default upload;