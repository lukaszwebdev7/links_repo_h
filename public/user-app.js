const userNameDOM = document.querySelector('#user-name');
const logOutBtnDOM = document.querySelector('#log-out');
const formDOM = document.querySelector('#form');
const linksDOM = document.querySelector('#links');
const categoriesDOM = document.querySelector('#categories');
const btnsDOM = document.querySelector('#btns');
const loadingDOM = document.querySelector('#loading-text');
const nameInputDOM = document.querySelector('#name-input');
const areaInputDOM = document.querySelector('#area-input');
const addressInputDOM = document.querySelector('#address-input');
const formAlertDOM = document.querySelector('#form-alert');
const bodyDOM = document.querySelector('#top');

const showName = () => {
	const userName = localStorage.getItem('user-name');
	userNameDOM.textContent = userName;
};

showName();

const logOut = () => {
	bodyDOM.innerHTML = 'Sesja została zakończona. Zaloguj się ponownie.';
	localStorage.removeItem('token');
	localStorage.removeItem('user-name');
	window.location.assign('/');
};

logOutBtnDOM.addEventListener('click', logOut);

const addLink = async (e) => {
	e.preventDefault();

	const name = nameInputDOM.value;
	const area = areaInputDOM.value;
	const address = addressInputDOM.value;
	const token = localStorage.getItem('token');

	try {
		await axios.post(
			'/api/v1/links',
			{
				name,
				area,
				address
			},
			{
				headers: {
					ContentType: 'application/json',
					Authorization: `Bearer ${token}`
				}
			}
		);

		nameInputDOM.value = '';
		areaInputDOM.value = '';
		addressInputDOM.value = '';
		btnsDOM.innerHTML = '';
		showLinks();
	} catch (error) {
		formAlertDOM.textContent = error.response.data.msg || error.response.data;
	}
};

formDOM.addEventListener('submit', addLink);

const showLinks = async () => {
	const urlSearchParams = new URLSearchParams(window.location.search);
	const params = Object.fromEntries(urlSearchParams.entries());
	const { page, area } = params;

	loadingDOM.style.visibility = 'visible';
	const token = localStorage.getItem('token');
	try {
		const { data: { links, count } } = await axios.get(`/api/v1/links/query?page=${page}&area=${area}`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		if (links.length < 1) {
			linksDOM.innerHTML = '<h5 class="text-blue-700 text-center">Nie wpisano jeszcze żadnych adresów.</h5>';
			loadingDOM.style.visibility = 'hidden';
			return;
		}
		const allLinks = links
			.map((link) => {
				const { _id: linkID, name, area, address } = link;
				let candidateAddress = address;
				const https = 'https://';
				const httpwww = 'http://www.';
				const httpswww = 'https://www.';
				const www = 'www.';
				if (candidateAddress.startsWith(https)) {
					candidateAddress = candidateAddress.substring(https.length);
				}
				if (candidateAddress.startsWith(httpwww)) {
					candidateAddress = candidateAddress.substring(httpwww.length);
				}
				if (candidateAddress.startsWith(httpswww)) {
					candidateAddress = candidateAddress.substring(httpswww.length);
				}
				if (candidateAddress.startsWith(www)) {
					candidateAddress = candidateAddress.substring(www.length);
				}

				const areaColor =
					area === 'nauka'
						? 'text-nauka'
						: '' || area === 'praca'
							? 'text-praca'
							: '' || area === 'rozrywka' ? 'text-rozrywka' : '' || area === 'zakupy' ? 'text-zakupy' : '';

				const editedAddress = `https://${candidateAddress}`;
				return `
				    <div class="mx-auto mt-8 w-11/12 sm:w-3/4 lg:w-2/3 2xl:w-3/4 shadow-md hover:shadow-lg transition duration-300 mb-4 bg-white">
					    <div class="py-2 p-10 bg-white rounded-xl">
						    <p class="text-xl text-gray-700 font-bold mb-2">${name}</p>
						    <p class=${areaColor}>${area}</p>
							<div class="h-2"></div>
						    <div>
							    <a href=${editedAddress} target="_blank" class="text-blue-600 font-bold underline break-words">${address}</a>
						    </div>
							<div class="flex justify-end">
							    <a href="edit.html?id=${linkID}" class="mr-4 bg-edit-btn text-white rounded px-2 hover:underline">
							        edytuj
						        </a>
						        <button type="button" class="delete-btn flex items-center bg-black text-white p1-3 px-2 rounded-md hover:bg-gray-500 transition duration-300" data-id="${linkID}"><span class="inline-block">usuń</span>							        
						        </button>
							</div>						                             
						</div>
					</div>
                    `;
			})
			.join('');

		linksDOM.innerHTML = allLinks;

		if (count >= 2) {
			for (let i = 1; i <= count; i++) {
				const btn = document.createElement('button');
				btn.dataset.index = [ i ];
				btn.innerText = [ i ];
				btn.addEventListener('click', changePage);
				btn.setAttribute(
					'class',
					'bg-black text-white px-2 mr-2 rounded hover:bg-gray-500 transition duration-300'
				);
				btnsDOM.appendChild(btn);
			}
			btnsDOM.classList.add('mb-24');
		}
	} catch (error) {
		linksDOM.innerHTML = '<h5 class="">Wystąpił błąd, spróbuj proszę później.</h5>';
	}
	loadingDOM.style.visibility = 'hidden';
};

showLinks();

const changePage = async (e) => {
	btnsDOM.innerHTML = '';
	const el = e.target;
	const page = el.dataset.index;
	const urlSearchParams = new URLSearchParams(window.location.search);
	const params = Object.fromEntries(urlSearchParams.entries());
	const { area } = params;
	window.location.replace(`http://localhost:3000/user.html?page=${page}&area=${area}`);
	showLinks();
};

const chooseArea = (e) => {
	btnsDOM.innerHTML = '';
	const el = e.target;
	const area = el.dataset.category;
	window.location.replace(`http://localhost:3000/user.html?page=1&area=${area}`);
	showLinks();
};

categoriesDOM.addEventListener('click', chooseArea);

const deleteLink = async (e) => {
	const el = e.target;
	if (el.classList.contains('delete-btn')) {
		const id = el.dataset.id;
		const token = localStorage.getItem('token');
		try {
			await axios.delete(`/api/v1/links/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			showLinks();
		} catch (error) {
			console.log(error);
		}
	}
};

linksDOM.addEventListener('click', deleteLink);
