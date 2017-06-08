const fs = require('fs');
const execFileSync = require('child_process').execFileSync;

const Koa = require('koa');
const app = new Koa();


const PORT = process.env.PORT || 3000;
const youtubedl = '/usr/local/bin/youtube-dl';


function update() {
    let buffer = execFileSync(youtubedl, ['-U'])
    return buffer.toString('utf8').split('\n').filter(e => e).slice(-1)[0]
}

function download(vid) {
    let buffer = execFileSync(youtubedl, ['-k', '-f', 'bestaudio', '-x', '--audio-quality', '0', '--audio-format', 'mp3', `http://www.youtube.com/watch?v=${vid}`])
    return buffer.toString('utf8').split('\n').filter(e => e).slice(-1)[0].match(/^\[ffmpeg\] Destination: (.*\.mp3)$/)[1]
}

app.use(ctx => {
  let vid = (ctx.request.url.match(/^\/([a-zA-Z0-9_-]{11})$/) || [null, null])[1];
  if (vid) {
    let updateLog = update()
    let fileName = download(vid)

    ctx.res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    ctx.res.setHeader('Content-Length', fs.statSync(fileName).size);
    ctx.body = fs.createReadStream(fileName);

    console.log(`${vid}; ${updateLog}; ${fileName}`)
  }
});

app.listen(PORT);
