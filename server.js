const express = require("express");
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static("static"));
app.use("/css", express.static("www/css"));
app.use("/img", express.static("www/img"));
app.use("/js", express.static("www/js"));

app.get("/", (req, res) => {
	res.render('./pages/index.ejs', {});
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});