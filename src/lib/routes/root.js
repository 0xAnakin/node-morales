const pkg = require('../../../package.json');

module.exports = (req, res) => {
    res.send(`${pkg.name} - ${pkg.version}`);
}