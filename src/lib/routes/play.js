const yt = require('youtube-search-without-api-key');
const {
    addSong
} = require('../common');

module.exports = async (req, res) => {

    const play_request = req.params.play_request.trim();
    
    if (play_request.length) {

        try {

            const play_results = await yt.search(play_request);

            if (play_results.length) {

                const song = {
                    id: play_results[0].id.videoId,
                    url: play_results[0].url,
                    title: play_results[0].title,
                    duration: play_results[0].duration_raw
                };

                addSong(song);

                res.json(song);

            } else {
                res.status(404).end(`No song '${play_request}' was found`);
            }

        } catch (err) {

            res.status(500).send(`Failed to retrieve '${play_request}'`);

            console.error(err);

        }

    } else {
        res.send(400).send('Bad Request');
    }

}