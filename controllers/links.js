const Link = require('../models/Link');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllLinks = async (req, res) => {
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 2;
	const skip = (page - 1) * limit;

	if (req.query.area === 'wszystkie') {
		let links = await Link.find({ createdBy: req.user.userId }).limit(limit).skip(skip);
		links = [ ...links ].sort((a, b) => {
			return b.updatedAt - a.updatedAt;
		});
		const amountOfLinks = await await Link.find({ createdBy: req.user.userId });
		const pages = Math.ceil(amountOfLinks.length / limit);
		res.status(StatusCodes.OK).json({ links, count: pages });
	} else {
		let links = await Link.find({ createdBy: req.user.userId, area: req.query.area }).limit(limit).skip(skip);
		links = [ ...links ].sort((a, b) => {
			return b.updatedAt - a.updatedAt;
		});
		const amountOfLinks = await await Link.find({ createdBy: req.user.userId, area: req.query.area });
		const pages = Math.ceil(amountOfLinks.length / limit);
		res.status(StatusCodes.OK).json({ links, count: pages });
	}
};

const getSingleLink = async (req, res) => {
	const { user: { userId }, params: { id: linkId } } = req;
	const link = await Link.findOne({
		_id: linkId,
		createdBy: userId
	});

	if (!link) {
		throw new NotFoundError(`Nie znaleziono adresu o id: ${linkId}.`);
	}

	res.status(StatusCodes.OK).json({ link });
};

const createLink = async (req, res) => {
	req.body.createdBy = req.user.userId;
	const link = await Link.create(req.body);
	res.status(StatusCodes.CREATED).json({ link });
};

const updateLink = async (req, res) => {
	const { user: { userId }, params: { id: linkId } } = req;

	const updatedLink = await Link.findByIdAndUpdate({ _id: linkId, createdBy: userId }, req.body, {
		new: true,
		runValidators: true
	});

	if (!updatedLink) {
		throw new BadRequestError(`Nie znaleziono adresu o id: ${linkId}.`);
	}

	res.status(StatusCodes.OK).json({ updatedLink });
};

const deleteLink = async (req, res) => {
	const { user: { userId }, params: { id: linkId } } = req;

	const link = await Link.findByIdAndRemove({
		_id: linkId,
		createdBy: userId
	});

	if (!link) {
		throw new NotFoundError(`Nie znaleziono adresu o id: ${linkId}.`);
	}

	res.status(StatusCodes.OK).send();
};

module.exports = {
	getAllLinks,
	getSingleLink,
	createLink,
	updateLink,
	deleteLink
};
