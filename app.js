const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const multer= require('multer');
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
   storage: storage

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



app.use('/', indexRouter);
app.use('/users', usersRouter);

//public folder
app.use(express.static('./public'));

app.get('/', (req,res)=> res.render('index'));

app.post('/upload', (req, res) => {
    upload(req,res, (err) =>{
       if(err){
           res.render('index', {
               msg: err
           });
       } else{
           console.log(req.file);
           res.send('test');
       }
    });
});

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
