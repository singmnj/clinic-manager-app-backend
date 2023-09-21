const User = require('../model/User');


const handleLogout = async (request, response) => {
	//on client, also delete the access token
	const cookies = request.cookies;
	//check for validity of request body
	if(!cookies?.jwt) return response.sendStatus(204); //No Content
	const refreshToken = cookies.jwt;
	//is refresh token in db ?
	const foundUser = await User.findOne({ 'refreshToken': refreshToken }).exec();
	if(!foundUser) {
		response.clearCookie('jwt', { httpOnly: true, sameSite:'None', secure: true });
		return response.sendStatus(204);
	}
	//delete refresh token from DB
	await User.findOneAndUpdate({ 'username': foundUser.username }, { 'refreshToken': '' });
	response.clearCookie('jwt', { httpOnly: true, sameSite:'None', secure: true }); //secure: true -> only serves on https
	response.sendStatus(204);
};


module.exports = { handleLogout };