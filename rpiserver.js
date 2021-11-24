const express = require( 'express' ),
      env = require('dotenv').config(),
      bodyParser = require("body-parser"),
      cookie = require('cookie-session'),
      serveIndex = require('serve-index'),
      fs = require('fs'),
      http = require('http'),
      spawn = require("child_process").spawn;
      
const app = express();
const PORT = 80;
const server = http.createServer(app);
const io = require('socket.io')(server)
const dir = process.env.DIREC+"/public/";
app.use( express.urlencoded({ extended:true }) )
app.use('/timelapse', serveIndex(dir+'/timelapse'));
app.use('/images', serveIndex(dir + '/images'));
app.use( bodyParser.json() )

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

io.on('connection', (socket) => {
	console.log('connected');
	
	socket.on('disconnect', () => {
		console.log('disconnected');
	});
})


app.post('/adminCompileLapse', (req,res)=> {
    args=[
	'-framerate', req.body.frameRate,
	'-pattern_type','glob',
	'-i','/home/pi/website/public/images/*.jpg',
	'-c:v','libx264',
  	'-frames:v', (req.body.maxFrames === "" ? '180' : req.body.maxFrames),
	'-crf','20','/home/pi/website/public/timelapse/'+ req.body.nameOfLapse +'.mp4']

    let cmd = spawn('ffmpeg', args);
    io.emit('cmd', 'compiling');
    cmd.stdout.on('data', (data) => {
	io.emit('cmd', data);
	});
    cmd.stdout.on('close', (data) => {
	io.emit('cmd', 'done compiling');
	});
    cmd.stderr.on('data', (data) => {
	io.emit('cmd', data.toString());
	});
})

app.use(express.static("./public/"));
const listener = server.listen(PORT, () => {
  console.log("Listening on port " + listener.address().port);
});
//app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
