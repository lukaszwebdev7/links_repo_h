const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {
	let customError = {
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg: err.message || 'Coś poszło nie tak, sporóbuj ponownie później.'
	};

	if (err.name === 'ValidationError') {
		customError.msg = Object.values(err.errors).map((item) => item.message).join(' ');
		customError.statusCode = 400;
	}

	if (err.code && err.code === 11000) {
		customError.msg = `Podany adres e-mail - ${Object.values(
			err.keyValue.email.split(' ')
		)} - jest już zajęty. Wpisz proszę inny adres.`;
		customError.statusCode = 400;
	}

	if (err.name === 'CastError') {
		customError.msg = `Nieprawidłowy format id: ${err.value} adresu strony.`;
		customError.statusCode = 404;
	}

	return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
