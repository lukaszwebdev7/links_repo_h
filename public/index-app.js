const formDOM = document.querySelector('#form');
const emailInputDOM = document.querySelector('#email-input');
const passwordInputDOM = document.querySelector('#password-input');
const formAlertDOM = document.querySelector('#form-alert');
const formAlertResetDOM = document.querySelector('#form-alert-reset');
const passwordResetBtnDOM = document.querySelector('#reset');
const registrationBtnDOM = document.querySelector('#registration');

formDOM.addEventListener('submit', async (e) => {
	e.preventDefault();
	const email = emailInputDOM.value;

	const password = passwordInputDOM.value;

	try {
		const { data } = await axios.post('/api/v1/auth/login', { email, password });

		emailInputDOM.value = '';
		passwordInputDOM.value = '';

		localStorage.setItem('token', data.token);
		localStorage.setItem('user-name', data.user.name);
		window.location.assign(`user.html?page=1&area=wszystkie`);
	} catch (error) {
		formAlertDOM.textContent = error.response.data.msg || error.response.data;
		localStorage.removeItem('token');
	}
	setTimeout(() => {
		formAlertDOM.style.display = 'none';
	}, 3000);
});

const passwordReset = async (e) => {
	e.preventDefault();
	const email = emailInputDOM.value;
	if (!email) {
		formAlertResetDOM.textContent = 'Wpisz proszę adres e-mail.';
		return;
	}
	try {
		await axios.post('/api/v1/auth/mailpasswordreset', { email });
		emailInputDOM.value = '';
		formAlertResetDOM.textContent = 'Link do zmiany hasła został wysłany. Sprawdź swoją pocztę.';
		setTimeout(() => {
			window.location.assign('/');
		}, 3000);
	} catch (error) {
		formAlertDOM.textContent = error.response.data.msg || error.response.data;
	}
	setTimeout(() => {
		formAlertResetDOM.style.display = 'none';
	}, 3000);
};

passwordResetBtnDOM.addEventListener('click', passwordReset);

const registration = () => {
	const link = 'registration.html';
	window.location.assign(link);
};

registrationBtnDOM.addEventListener('click', registration);
