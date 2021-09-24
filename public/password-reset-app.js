const formDOM = document.querySelector('#form');
const passwordInputOneDOM = document.querySelector('#password-input-one');
const passwordInputTwoDOM = document.querySelector('#password-input-two');
const formAlertDOM = document.querySelector('#form-alert');

formDOM.addEventListener('submit', async (e) => {
	e.preventDefault();

	const password = passwordInputOneDOM.value;
	const repetedPassword = passwordInputTwoDOM.value;

	const urlSearchParams = new URLSearchParams(window.location.search);
	const params = Object.fromEntries(urlSearchParams.entries());
	const { email, uniqueString } = params;

	if (!password || !repetedPassword) {
		formAlertDOM.textContent = 'Wpisz proszę hasło';
		return;
	}
	if (password.length < 6 || repetedPassword.length < 6) {
		formAlertDOM.textContent = 'Hasło musi mieć przynajmniej 6 znaków.';
		return;
	}
	if (password !== repetedPassword) {
		formAlertDOM.textContent = 'Wpisano różne hasła. W obydwu polach wpisz proszę to samo hasło.';
		return;
	}

	try {
		await axios.post('/reset', { password, email, uniqueString });

		passwordInputOneDOM.value = '';
		passwordInputTwoDOM.value = '';
		formAlertDOM.textContent = 'Hasło zostało zmienione. Za chwilę przejdziesz do strony logowania.';

		setTimeout(() => {
			formAlertDOM.style.display = 'none';
			window.location.assign('index.html');
		}, 3000);
	} catch (error) {
		formAlertDOM.textContent = error.response.data.msg || error.response.data;
	}
	setTimeout(() => {
		formAlertDOM.style.display = 'none';
	}, 3000);
});
