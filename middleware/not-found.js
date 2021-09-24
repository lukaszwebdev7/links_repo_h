const notFound = (req, res) => res.status(404).send('Podana ścieżka żądania nie istnieje. Spróbuj ponownie później.');

module.exports = notFound;
