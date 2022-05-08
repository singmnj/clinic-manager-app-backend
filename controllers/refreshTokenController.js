const jwt = require('jsonwebtoken');

const users = require('../model/user');

const handleRefreshToken = async (request, response) => {

	const cookies = request.cookies;
	//check for validity of request body
	if(!cookies?.jwt) return response.sendStatus(401);
	//console.log(cookies.jwt);
	const refreshToken = cookies.jwt;
	const foundUser = await users.searchUser({ 'refreshToken': refreshToken });
	if(!foundUser) return response.sendStatus(403); //Forbidden
	//evaluate jwt
	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		(err, decoded) => {
			if(err || foundUser.username !== decoded.username) return response.sendStatus(403);
			const accessToken = jwt.sign(
				{ 'username': decoded.username },
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: '300s' }
			);
			response.json({ username: decoded.username, accessToken });
		}
	);
};


module.exports = { handleRefreshToken };