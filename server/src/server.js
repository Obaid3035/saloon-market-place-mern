import app from "./app";

const PORT = process.env.PORT || 4000;

app.listen(PORT,(err) => {
	if (!err) {
		console.log(`Server is running on ${PORT}`);
	} else {
		console.log(err);
	}
});
