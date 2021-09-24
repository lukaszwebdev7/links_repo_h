const mongoose = require('mongoose');

const LinkSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [ true, 'Wpisz proszę nazwę dla adresu strony.' ],
			maxlength: 150
		},
		address: {
			type: String,
			required: [ true, 'Wpisz proszę adres strony.' ],
			maxlength: 2048
		},
		area: {
			type: String,
			enum: [ 'nauka', 'praca', 'rozrywka', 'zakupy' ],
			required: [ true, 'Wybierz proszę kategorię.' ]
		},
		createdBy: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: [ true, 'Brak danych użytkownika.' ]
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Link', LinkSchema);
