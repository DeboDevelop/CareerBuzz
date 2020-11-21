module.exports = function(app) {
	const availableRooms = ["python", "javascript", "java", "php", "go"];

	app.get("/", function(req, res) {
		res.render("login");
	});

	app.get("/register", function(req, res) {
		res.render("register");
	});

	app.get("/room", function(req, res) {
		res.redirect("/");
	});

	app.post("/room", function(req, res) {
		const { username, password, roomName } = req.body;
		if (availableRooms.includes(roomName)) {
			if (
				(username === "avirupdutta" && password === "123456") ||
				(username === "johndoe" && password === "123456") ||
				(username === "davidkumar" && password === "123456") ||
				(username === "tonykumar" && password === "123456")
			) {
				return res.render("room", { username, roomName });
			}
		}
		return res.redirect("/");
	});
};
