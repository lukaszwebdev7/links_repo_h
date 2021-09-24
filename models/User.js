const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [ true, 'Wpisz proszę imię.' ],
		minlength: 3,
		maxlength: 50
	},
	email: {
		type: String,
		required: [ true, 'Wpisz proszę adres e-mail.' ],
		match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			'Wpisz proszę adres e-mail.'
		],
		unique: true
	},
	password: {
		type: String,
		required: [ true, 'Wpisz proszę hasło.' ],
		minlength: 6
	},
	verificationToken: {
		type: String
	},
	isVerified: {
		type: Boolean,
		default: false
	}
});

UserSchema.pre('save', async function() {
	const salt = await bcrypt.genSalt(10);
	const saltWithoutSlashes = salt.replaceAll(/\//g, '');
	this.verificationToken = saltWithoutSlashes;
});

UserSchema.methods.createJWT = function() {
	return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_LIFETIME
	});
};

const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
const accessToken = oAuth2Client.getAccessToken();

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		type: 'OAuth2',
		user: 'lucas.nodemailer@gmail.com',
		clientId: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		refreshToken: process.env.REFRESH_TOKEN,
		accessToken: accessToken
	}
});

UserSchema.methods.sendMail = async function() {
	const mailData = {
		from: 'lucas.nodemailer@gmail.com',
		to: `${this.email}`,
		subject: 'Potwierdzenie adresu e-mail ze strony links_repository.',
		html: `Kliknij "Potwierdź" celu dokończenia rejestracji. <a href="https://links-repo.herokuapp.com/verify/${this
			.verificationToken}">Potwierdź</a>`
	};

	await new Promise((resolve, reject) => {
		transporter.sendMail(mailData, (err, info) => {
			if (err) {
				console.error(err);
				reject(err);
			} else {
				console.log(info);
				resolve(info);
			}
		});
	});
};

UserSchema.methods.sendPasswordReset = async function({ email, uniqueString }) {
	const mailData = {
		from: 'lucas.nodemailer@gmail.com',
		to: `${email}`,
		subject: 'Zmiana hasła ze strony links_repository.',
		html: `Otrzymaliśmy prośbę o zmianę hasła. Kliknij "Przejdź" w celu dokonania jego zmiany. <a href="https://links-repo.herokuapp.com/reset.html?email=${email}&uniqueString=${uniqueString}">Przejdź</a> <p>Jeśli to nie ty wysłałeś/aś prośbę o zmianę hasła, zignoruj tę wiadomość.</p>`
	};

	await new Promise((resolve, reject) => {
		transporter.sendMail(mailData, (err, info) => {
			if (err) {
				console.error(err);
				reject(err);
			} else {
				console.log(info);
				resolve(info);
			}
		});
	});
};

UserSchema.methods.comparePassword = async function(candidatePassword) {
	const isMatch = await bcrypt.compare(candidatePassword, this.password);
	return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
