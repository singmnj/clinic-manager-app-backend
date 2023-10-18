const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../model/User");

const handleLogin = async (request, response) => {
	const { username, password } = request.body;
	//check for validity of request body
	if (!username || !password)
		return response
			.status(400)
			.json({ message: "Username and Password are required." });
	const foundUser = await User.findOne({ username: username }).exec();
	if (!foundUser) return response.sendStatus(401); //Unauthorized
	//evaluate password
	const result = await bcrypt.compare(password, foundUser.password);
	if (result) {
		//create JWTs
		const accessToken = jwt.sign(
			{ username: foundUser.username },
			process.env.ACCESS_TOKEN_SECRET,
			{
				expiresIn: "2h",
			}
		);
		const refreshToken = jwt.sign(
			{ username: foundUser.username },
			process.env.REFRESH_TOKEN_SECRET,
			{
				expiresIn: "1d",
			}
		);
		await User.findOneAndUpdate(
			{ username: foundUser.username },
			{ refreshToken: refreshToken }
		);
		response.cookie("jwt", refreshToken, {
			httpOnly: true,
			sameSite: "None",
			secure: true,
			maxAge: 24 * 60 * 60 * 1000,
		});
		console.log("logged in: ", { accessToken });
		response.json({ accessToken });
	} else {
		response.sendStatus(401);
	}
};

module.exports = { handleLogin };
