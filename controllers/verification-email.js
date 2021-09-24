const User = require('../models/User');

const verification = async (req, res) => {
	const { uniqueString } = req.params;
	const user = await User.findOne({ verificationToken: uniqueString });
	if (user) {
		user.isVerified = true;
		await user.save();
		res.redirect('/');
	} else {
		res.json('User nor found.');
	}
};

module.exports = verification;
