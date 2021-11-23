const express = require( 'express' ),
      env = require('dotenv').config(),
      cookie = require('cookie-session'),
      spawn = require("child_process").spawn;
      
const app = express();
const PORT = 80;
const dir = '/home/pi/website/'
const { ChildProcess } = require('child_process');
//const dir = 'C:/Users/Nicholas/git/faradaycam-website'
const serveIndex = require('serve-index');
app.use( express.urlencoded({ extended:true }) )
app.use('/timelapse', serveIndex(dir + '/timelapse'));
app.use('/images', serveIndex(dir + '/images'));

app.use(cookie({
    name: 'session',
    keys: [process.env.KEYONE, process.env.KEYTWO]
  }))

app.use(function(req,res,next) {
    if( !req.originalUrl.includes('admin')) next();
    else {
        if (req.session.login === true) next();
        else res.sendFile(dir+'/accountLogin.html')
    }
      
  })

app.post( '/login', (req,res)=> {
      if(req.body.username === process.env.USERNAME && req.body.password === process.env.PASSWORD) {
        req.session.login = true;
        res.redirect('adminPanel.html')
      }
      else {
        res.sendFile(dir+'/accountLogin.html')
      }
    }
)

app.post('/adminCompileLapse', (req,res)=> {
    args=[
	'-framerate', req.body.fps,
	'-pattern_type','glob',
	'-i','/home/pi/website/images/*.jpg',
	'-c:v','libx264',
	'-crf','20','/home/pi/website/timelapse/'+ req.body.nameOfLapse +'.mp4']

    spawn('ffmpeg', args);
    res.redirect('index.html')
})

app.use(express.static(dir));
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
