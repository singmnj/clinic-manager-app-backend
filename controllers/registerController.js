const bcrypt = require('bcryptjs');

const users = require('../model/user');

const register = async (request, response) => {

	const { username, password } = request.body;
	//check for validity of request body
	if(!username || !password) return response.status(400).json({ 'message': 'Username and Password are required.' });
	//check for duplicate username in the DB
	const userObj = await users.searchUser({ 'username': username });
	if(userObj) return response.sendStatus(409);
	try {
		//encrypt the password
		const hashedPassword = await bcrypt.hash(password, 10);
		//store the new user
		const newUser = {
			'username': username,
			'password': hashedPassword
		};
		await users.addUser(newUser);
		response.status(201).json({ 'success': `New User ${username} created` });
	} catch (error) {
		response.status(500).json({ 'message': error.message });
	}
};


module.exports = { register };