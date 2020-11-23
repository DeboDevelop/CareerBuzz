const bcryptjs = require("bcryptjs");
const User = require("./models/users");

module.exports = function(app) {
	const availableRooms = ["JEE", "UPSC", "NIMCET", "Banking", "Railway"];

	app.get("/", function(req, res) {
		res.render("index");
	});
	app.get("/login", function(req, res) {
		res.render("login");
	});

	app.get("/register", function(req, res) {
		res.render("register");
	});

	app.get("/room", function(req, res) {
		res.redirect("/login");
	});

	app.post("/register", async function(req, res) {
		const { name, email, password, password2 } = req.body;

		let errors = [];

		if (!name || !email || !password || !password2) {
			errors.push({ msg: "Please enter all fields" });
		}

		if (password != password2) {
			errors.push({ msg: "Passwords do not match" });
		}

		if (errors.length > 0) {
			res.render("register", {
				errors,
				name,
				email
			});
		} else {
			try {
				let user = await User.findOne({ email: email });
				if (user) {
					errors.push({ msg: "Email already exists" });
					res.render("register", {
						errors,
						name,
						email
					});
				} else {
					const newUser = new User({
						name,
						email,
						password
					});
					try {
						bcryptjs.genSalt(10, async (error, salt) => {
							if (error) {
								throw error;
							}
							try {
								const hashedPassword = await bcryptjs.hash(
									newUser.password,
									salt
								);
								newUser.password = hashedPassword;
								try {
									const user = await newUser.save();
									res.redirect("/login");
								} catch (e) {
									console.log(e);
								}
							} catch (e) {
								console.log(e);
							}
						});
					} catch(e) {
						console.log(e);
					}
				}
			} catch(e) {
				console.log(e);
			}
		}
	});

	app.post("/login", async function(req, res) {
		const { username, password, roomName } = req.body;
		let errors = [];
		if(!username || !password || !roomName) {
			errors.push({ msg: "Please enter all fields" });
			return res.render("login", { errors, username });
		}
		if (availableRooms.includes(roomName)) {
			let user = await User.findOne({name: username});
			if (user != null) {
			  try {
				if(await bcryptjs.compare(password, user.password)) {
					return res.render("room", { username, roomName });
				} else {
					errors.push({ msg: "The username and password doesn't match" });
				}
			  } catch(e) {
				console.log(e);
			  }
			} else {
				errors.push({ msg: "Enter valid username" });
			}
		}
		return res.render("login", { errors, username });
	});
};
