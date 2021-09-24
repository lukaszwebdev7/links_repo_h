const formDOM = document.querySelector('#form');
const usernameInputDOM = document.querySelector('#username-input');
const emailInputDOM = document.querySelector('#email-input');
const passwordInputDOM = document.querySelector('#password-input');
const formAlertDOM = document.querySelector('#form-alert');

formDOM.addEventListener('submit', async (e) => {
	e.preventDefault();

	const name = usernameInputDOM.value;
	const password = passwordInputDOM.value;
	const email = emailInputDOM.value;

	if (!name) {
		formAlertDOM.textContent = 'Wpisz proszę imię.';
		return;
	}
	if (!email) {
		formAlertDOM.textContent = 'Wpisz proszę adres e-mail.';
		return;
	}
	if (!password) {
		formAlertDOM.textContent = 'Wpisz proszę hasło';
		return;
	}
	if (password.length < 6) {
		formAlertDOM.textContent = 'Hasło musi mieć przynajmniej 6 znaków.';
		return;
	}

	try {
		await axios.post('/api/v1/auth/register', { name, email, password });

		usernameInputDOM.value = '';
		passwordInputDOM.value = '';
		emailInputDOM.value = '';

		window.location.assign('index.html');
	} catch (error) {
		formAlertDOM.textContent = error.response.data.msg || error.response.data;
	}
	setTimeout(() => {
		formAlertDOM.style.display = 'none';
	}, 3000);
});
