const express = require( 'express' ),
      env = require('dotenv').config(),
      cookie = require('cookie-session'),
      serveIndex = require('serve-index'),
      fs = requires('fs'),
      spawn = require("child_process").spawn;
      
const app = express();
const PORT = 80;
const dir = process.env.DIREC+"/public/";
const lapse = process.env.DIREC
app.use( express.urlencoded({ extended:true }) )
app.use('/timelapse', serveIndex(lapse + '/timelapse'));
app.use('/images', serveIndex(lapse + '/images'));

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
	'-framerate', req.body.frameRate.toString(),
	'-pattern_type','glob',
	'-i','/home/pi/website/images/*.jpg',
	'-c:v','libx264',
  '-frames:v', (req.body.maxFrames === "" ? '180' : req.body.maxFrames),
	'-crf','20','/home/pi/website/timelapse/'+ req.body.nameOfLapse +'.mp4']

    spawn('ffmpeg', args);
    res.redirect('index.html')
})

app.use(express.static(dir));
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
