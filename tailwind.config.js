module.exports = {
	purge: { enabled: true, content: [ './public/**/*.html', './public/**/*.js' ] },
	darkMode: false, // or 'media' or 'class'
	theme: {
		textColor: (theme) => ({
			...theme('colors'),
			nauka: '#81B214',
			rozrywka: '#F89D13',
			praca: '#00EAD3',
			zakupy: '#DC2ADE'
		}),
		extend: {
			backgroundColor: (theme) => ({
				...theme('colors'),
				'edit-btn': '#54E346'
			})
		}
	},
	variants: {
		extend: {}
	},
	plugins: []
};
