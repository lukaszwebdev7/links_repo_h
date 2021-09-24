const bcrypt = require('bcryptjs');
const User = require('../models/User');

const passwordReset = async (req, res) => {
	const { email, password, uniqueString } = req.body;
	const user = await User.findOne({ email: email });
	if ((user.verificationToken = uniqueString)) {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		user.password = hashedPassword;
		await user.save();
		res.redirect('/');
	} else {
		res.json('User nor found.');
	}
};

module.exports = passwordReset;
