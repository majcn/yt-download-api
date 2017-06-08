const fs = require('fs');
const execFileSync = require('child_process').execFileSync;

const Koa = require('koa');
const app = new Koa();


const PORT = process.env.PORT || 3000;
const youtubedl = `${__dirname}/youtube-dl`;


function update() {
    let buffer = execFileSync(youtubedl, ['-U'])
    return buffer.toString('utf8').split('\n').filter(e => e).slice(-1)[0]
}

function download(vid) {
    let buffer = execFileSync(youtubedl, ['-k', '-f', 'bestaudio', '-x', '--audio-quality', '0', '--audio-format', 'mp3', `http://www.youtube.com/watch?v=${vid}`])
    return buffer.toString('utf8').split('\n').filter(e => e).slice(-1)[0]
}

app.use(ctx => {
  let vid = (ctx.request.url.match(/^\/([a-zA-Z0-9_-]{11})$/) || [null, null])[1];
  if (vid) {
    let updateLog = update()
    let downloadLog = download(vid)

    let fileName = downloadLog.match(/^\[ffmpeg\] Destination: (.*\.mp3)$/)[1]
    let fullFileName = `${__dirname}/${fileName}`;
    let fileSize = fs.statSync(fullFileName).size;

    ctx.res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    ctx.res.setHeader('Content-Length', fileSize);
    ctx.body = fs.createReadStream(fullFileName);

    console.log(`${vid}; ${updateLog}; ${fileName}`)
  }
});

app.listen(PORT);
