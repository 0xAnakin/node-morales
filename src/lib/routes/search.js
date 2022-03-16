const yt = require('youtube-search-without-api-key');

module.exports = async (req, res) => {

    const search_request = req.params.search_request.trim();

    if (search_request.length) {

        try {

            console.log(`searching for: ${search_request}`);

            const search_results = await yt.search(search_request);

            if (search_results.length) {
                
                const song = {
                    id: play_results[0].id.videoId,
                    url: play_results[0].url,
                    title: play_results[0].title,
                    duration: play_results[0].duration_raw
                };

                res.json(song);

            } else {
                res.status(404).end(`No song '${play_request}' was found`);   
            }

        } catch (err) {

            res.status(500).send(`Failed to retrieve '${search_request}'`);

            console.error(err);

        }

    } else {
        res.send(400).send('Bad Request');
    }

}