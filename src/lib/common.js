const {
    time
} = require('console');
const Stream = require('stream');
const Throttle = require('throttle');
const throttle = new Throttle(128000 / 8);
const leecher = require('./leecher');

let timeout = null;
let playing_index = 0;

const playlist = [];
const clients = new Set();
const buffer = new Stream.PassThrough();

const options = {
    loop: true
}

buffer.pipe(throttle).on('data', (chunk) => {

    for (const client of clients) {

        if (!client.headersSent) {
            client.header({
                'Content-Type': 'audio/mpeg',
                'Connection': 'keep-alive'
            });
        }

        client.write(chunk);
    }

}).on('error', (err) => {
    console.error(err);
}).on('pause', () => {
    console.log('buffer paused');
}).on('resume', () => {
    console.log('buffer resumed');
}).on('unpipe', () => {
    console.log('buffer unpiped');
}).on('end', () => {
    console.log('buffer ended');
}).on('close', () => {
    console.log('buffer closed');
}).on('finish', () => {
    console.log('buffer finished');
})

const convertDurationToMilliseconds = (str) => {

    const arr = str.split(':').map((d) => parseInt(d)).reverse();

    let s = 0;

    for (let i = 0; i < arr.length; i++) {
        if (i === 0) {
            s = arr[i];
        }
        if (i === 1) {
            s += arr[i] * 60
        }
        if (i === 2) {
            s += arr[i] * 60 * 60
        }
    }

    return s * 1000;

}

const addSong = (song) => {

    if (playlist.length) {

        playlist.push(song);

        console.log(`queueing: ${song.title}`);

    } else {

        playlist.push(song);

        playSong(playlist[0]);

        console.log(`playing: ${song.title}`);

    }

}

const playSong = (song) => {

    leecher(song.url).on('data', (chunk) => {

        buffer.push(chunk);

    }).on('error', (err) => {
        
        clearInterval(timeout);
        
        nextSong();

        console.error(err);
        
    }).on('pause', () => {
        console.log('leecher paused');
    }).on('resume', () => {
        console.log('leecher resumed');
    }).on('unpipe', () => {
        console.log('leecher unpiped');
    }).on('end', () => {
        console.log('leecher ended');
    }).on('close', () => {
        console.log('leecher closed');
    }).on('finish', () => {

        console.log('leecher finished');

        const next = convertDurationToMilliseconds(song.duration);

        clearInterval(timeout);

        timeout = setTimeout(() => nextSong(), next);

    });

}

const nextSong = () => {

    if ((playing_index + 1) < playlist.length) {
        console.log('case 1');
        playSong(playlist[++playing_index]);

    } else if (playlist.length && options.loop) {
        console.log('case 2');
        playing_index = 0;

        playSong(playlist[playing_index]);

    }

}

const prevSong = () => {

    if ((playing_index - 1) >= 0) {

        playSong(playlist[--playing_index]);

    } else if (playlist.length && options.loop) {

        playing_index = playlist.length - 1;

        playSong(playlist[playing_index]);

    }

}

exports.clients = clients;
exports.buffer = buffer;

exports.addSong = addSong;
exports.playSong = playSong;
exports.nextSong = nextSong;
exports.prevSong = prevSong;