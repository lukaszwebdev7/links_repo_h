const formDOM = document.querySelector('#form');
const backBtnDOM = document.querySelector('#back');
const linkDOM = document.querySelector('#link');
const nameInputDOM = document.querySelector('#name-input');
const areaInputDOM = document.querySelector('#area-input');
const addressInputDOM = document.querySelector('#address-input');
const formAlertDOM = document.querySelector('#form-alert');

const params = window.location.search;
const id = new URLSearchParams(params).get('id');
const token = localStorage.getItem('token');

let tempData = [];

const goBack = () => {
	history.back();
};

backBtnDOM.addEventListener('click', goBack);

const showLink = async () => {
	try {
		const { data: { link } } = await axios.get(`/api/v1/links/${id}`, {
			headers: {
				ContentType: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		const { name, area, address } = link;
		tempData.push(name, area, address);

		linkDOM.innerHTML = `
                    <p>${name}</p>
                    <p>${area}</p>
                    <p class="break-words">${address}</p>
        `;
	} catch (error) {
		formAlertDOM.textContent = error.response.data.msg || error.response.data;
	}
};

showLink();

formDOM.addEventListener('submit', async (e) => {
	e.preventDefault();

	try {
		const editedName = nameInputDOM.value;
		const editedArea = areaInputDOM.value;
		const editedAddress = addressInputDOM.value;

		await axios.patch(
			`/api/v1/links/${id}`,
			{
				name: editedName || tempData[0],
				area: editedArea || tempData[1],
				address: editedAddress || tempData[2]
			},
			{
				headers: {
					ContentType: 'application/json',
					Authorization: `Bearer ${token}`
				}
			}
		);
		if (editedName || editedArea || editedAddress) {
			formAlertDOM.textContent = 'Dane adresu zostały zmienione. Za chwilę powrócisz do poprzedniej strony';
		} else {
			formAlertDOM.textContent = 'Za chwilę powrócisz do poprzedniej strony';
		}

		setTimeout(() => {
			window.location = document.referrer;
		}, 3000);
	} catch (error) {
		formAlertDOM.textContent = error.response.data.msg || error.response.data;
	}
	setTimeout(() => {
		formAlertDOM.style.display = 'none';
	}, 3000);
});
