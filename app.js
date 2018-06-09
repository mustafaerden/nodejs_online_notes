const express = require('express');
//public dosyasındaki custom css vs yolu için;
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const exphbs  = require('express-handlebars');

const app = express();

//Load Routes;
const notes = require('./routes/notes');
const users = require('./routes/users');

//Passport Config;
require('./config/passport')(passport);

//DB Config;
const db = require('./config/database');

//Database(mongoose) Bağlantısı;
mongoose.connect(db.mongoURI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


//Handlebars Middleware;
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Body Parse Middleware;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Method-Override Middleware;
app.use(methodOverride('_method'));

//Express-session Middleware;
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//Passport Middleware(mutlaka express-session middleware den sonra gelmeli);
app.use(passport.initialize());
app.use(passport.session());

//Connect-flash Middleware;
app.use(flash());

//Global Variables(connect-flash);(success ve error mesajlarını variabla a atadık ki istediğimiz yerde kolayca kullanalım);
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  //Login İşlemi için Global Variables;
  res.locals.user = req.user || null;
  next();
});

//public klasörü yol middleware i;
app.use(express.static(path.join(__dirname, 'public')));


//Index Route;
app.get('/', (req, res) => {
  res.render('index');
});

//About Route;
app.get('/about', (req, res) => {
  res.render('about');
});




//Use Routes;
app.use('/notes', notes);
app.use('/users', users);

//Port Tanımlaması;
const port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log('Server started on port ' + port);
});