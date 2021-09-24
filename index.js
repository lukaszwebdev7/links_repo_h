require('express-async-errors');
require('dotenv').config();
const express = require('express');

const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const app = express();

const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');

const authRouter = require('./routes/auth');
const linksRouter = require('./routes/links');
const verificationRouter = require('./routes/verification');
const resetRouter = require('./routes/password-reset');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.static('./public'));

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(rateLimiter({ windowsMs: 60 * 1000, max: 60 }));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/links', authenticateUser, linksRouter);
app.use('/verify', verificationRouter);
app.use('/reset', resetRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(port, console.log(`Server is listening on port ${port}...`));
	} catch (error) {
		console.log(error);
	}
};

start();
