const bcrypt = require('bcryptjs');
const passport = require('passport');

const user = require('../models/user');

const login = (request, response, next) => {
	passport.authenticate('local', (err, userObj) => {
		if(err) throw err;
		if(!userObj) response.status(403).send('login failed');
		else {
			request.logIn(userObj, (err) => {
				if(err) throw err;
				response.send('successfully authenticated');
			});
		}
	})(request, response, next);
};

const register = async (request, response) => {
	const userObj = await user.searchUser({ 'username': request.body.username });
	if(userObj) {
		response.send('username already exists');
	}
	else {
		const hashedPassword = await bcrypt.hash(request.body.password, 10);
		const newUser = {
			'username': request.body.username,
			'password': hashedPassword
		};
		await user.addUser(newUser);
		response.send('user added');
	}
};

const getUser = async (request, response) => {
	response.send(request.user);
};

module.exports = {
	login,
	register,
	getUser
};