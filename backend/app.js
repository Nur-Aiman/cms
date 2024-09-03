var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var clientsRouter = require('./routes/clientRoutes');
var counsellorsRouter = require('./routes/counsellorRoutes');
var adminsRouter = require('./routes/adminRoutes');
const { currentUser } = require('./controllers/clientController');

var app = express();

// CORS configuration
var corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = ['http://localhost:3000', 'https://harmony-hub-counselling-web.onrender.com']; // Add other allowed origins as needed
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,  // Allows cookies to be sent with requests
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/client', clientsRouter);
app.use('/counsellor', counsellorsRouter);
app.use('/admin', adminsRouter);

app.get('/api/current_user', currentUser);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
