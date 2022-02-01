const bcrypt = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;

const user = require('../models/user');

module.exports = function(passport) {
	//Called during login/sign up.
	passport.use(new localStrategy(async(username, password, done) => {
		try {
			const userObj = await user.searchUser({ 'username': username });
			if(!userObj) return done(null, false, { message: 'username not valid' });
			const result = await bcrypt.compare(password, userObj.password);
			if(result === true)
				return done(null, userObj);
			else
				return done(null, false, { message: 'password not valid' });
		}
		catch(e) {
			return done(e);
		}
	}));

	//called while after logging in / signing up to set user details in req.user
	passport.serializeUser((userObj, done) => done(null, userObj.id));

	passport.deserializeUser(async(id, done) => {
		const userObj = await user.searchUser({ 'id': id });
		const userInformation = {
			username: userObj.username,
		};
		return done(null, userInformation);
	});
};