const jwt = require("jsonwebtoken");

const verifyJWT = (request, response, next) => {
	const authHeader =
		request.headers.authorization || request.headers.Authorization;
	//console.log(authHeader);
	if (!authHeader?.startsWith("Bearer ")) return response.sendStatus(401);
	//console.log(authHeader);
	const token = authHeader.split(" ")[1];
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		if (err) return response.sendStatus(403);
		request.user = decoded.username;
		next();
	});
};

module.exports = verifyJWT;
