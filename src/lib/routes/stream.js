const {
    clients
} = require('../common');

module.exports = (req, res) => {

    res.on('close', () => {

        clients.delete(res);

        console.log(`${clients.size} client(s) connected`);

    })

    clients.add(res);

    console.log(`${clients.size} client(s) connected`);

}