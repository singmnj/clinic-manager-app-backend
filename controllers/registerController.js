const bcrypt = require("bcryptjs");

const User = require("../model/User");

const register = async (request, response) => {
	const { username, password } = request.body;
	console.log(request.body);
	//check for validity of request body
	if (!username || !password)
		return response
			.status(400)
			.json({ message: "Username and Password are required." });
	//check for duplicate username in the DB
	const userObj = await User.findOne({ username: username }).exec();
	if (userObj) return response.sendStatus(409);
	try {
		//encrypt the password
		const hashedPassword = await bcrypt.hash(password, 10);
		//store the new user
		await User.create({
			username: username,
			password: hashedPassword,
		});
		response.status(201).json({ success: `New User ${username} created` });
	} catch (error) {
		response.status(500).json({ message: error.message });
	}
};

module.exports = { register };
