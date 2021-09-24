const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { StatusCodes } = require('http-status-codes');
const { UnauthenticatedError } = require('../errors');

const register = async (req, res) => {
	const { name, email, password } = req.body;

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	const user = await User.create({ name, email, password: hashedPassword });
	const token = user.createJWT();
	user.sendMail();
	res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const passReset = async (req, res) => {
	const { email } = req.body;
	const userResetPassword = new User();

	const user = await User.findOne({ email });
	if (!user) {
		throw new UnauthenticatedError('Niewprawidłowe dane użytkownika.');
	} else {
		const uniqueString = user.verificationToken;
		userResetPassword.sendPasswordReset({ email, uniqueString });
		res.status(StatusCodes.OK).send();
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;

	if (!email) {
		throw new UnauthenticatedError('Wpisz proszę adres e-mail.');
	}
	if (!password) {
		throw new UnauthenticatedError('Wpisz proszę hasło');
	}

	const user = await User.findOne({ email });
	if (!user) {
		throw new UnauthenticatedError('Niewprawidłowe dane do logowania.');
	}
	if (!user.isVerified) {
		throw new UnauthenticatedError(
			'Na wskazany przez Ciebie adres e-mail został wysłany link do potwierdzenia rejestracji. Potwierdź rejestrację i wróć do logowania.'
		);
	}
	const isPasswordCorrect = await user.comparePassword(password);
	if (!isPasswordCorrect) {
		throw new UnauthenticatedError('Hasło jest nieprawidłowe.');
	}

	const token = user.createJWT();
	res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
	register,
	passReset,
	login
};
