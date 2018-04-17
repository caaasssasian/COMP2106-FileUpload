const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const multer= require('multer');
const fs = require('fs');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');


//Set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

//init upload
const upload = multer({
   storage: storage,
	 limits: {fileSize: 2000000},
	 fileFilter: (req, file, cb) => {
		 checkFileType(file, cb);
	 }
}).single('myimage');
const app = express();


// view engine setup
      app.set('views', path.join(__dirname, 'views'));
      app.set('view engine', 'ejs');

      app.use(logger('dev'));
      app.use(express.json());
      app.use(express.urlencoded({ extended: false }));
      app.use(cookieParser());
      app.use(express.static(path.join(__dirname, 'public')));



// app.use('/', indexRouter);
app.use('/users', usersRouter);

//public folder
app.use(express.static('./public'));

app.get('/', (req,res)=> res.render('index',{ title: 'File Upload', msgType: 'none', showImage: false}));

app.post('/upload', (req, res) => {
    upload(req,res, (err) =>{
       if(err){
           res.render('index', {
				title: 'File Upload',
				msgType: 'alert alert-danger',
				showImage: false,
            	msg: err
           });
	   } 
	   else {
			if(req.file == undefined) {
				res.render('index', {
					title: 'File Upload',
					msgType: 'alert alert-danger',
					showImage: false,
					msg: 'No File selected'
				});
			} else {
				console.log(req.file);
				res.render('index', {
					title: 'File Upload',
					msgType: 'alert alert-success',
					msg: 'File has Uploaded',
					showImage: true,
					file: `/uploads/${req.file.filename}`
			});
		}
       }
    });
});
// delete file
app.post('/delete', (req, res, next) => {
	// get the input from the hidden form
	let file = 'public' + req.body.file;
	// delet the file using the fs
	try {
		fs.unlinkSync(file);
		res.render('index', {
			title: 'File Upload',
			msgType: 'alert alert-primary',
			showImage: false,
			msg: 'File deleted'
		});
	} catch (err) {
		res.render('index', {
			title: 'File Upload',
			msgType: 'alert alert-danger',
			showImage: false,
			msg: err
		});
	}
});
// file check function
const checkFileType = function(file, cb){
	//allowed extentions
	const fileTypes = /jpg|jpeg|png|gif/;

	//check file extention
	const extType = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());

	// check the mime type
	const mimeType = fileTypes.test(file.mimetype);

	// check the file
	if(mimeType && extType){
		return cb(null, true);
	} else {
		cb('Error: That File is not an image')
	}
}
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
