require('dotenv').config()

var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    nodemailer = require('nodemailer'),
    flash        = require("connect-flash"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    session = require("express-session"),
    seedDB      = require("./seeds"),
    methodOverride = require("method-override");
    
//requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    // campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")
    
// mongoose.connect("mongodb://localhost/yelp_camp_v9");

mongoose.connect("mongodb+srv://chukovskid:Tatkovinata1@cluster0-kjuna.mongodb.net/test?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useCreateIndex: true,
		// useUnifiedTopology: true
}).then(() =>{
	console.log("Connected to online DB");
}).catch(err => {
	console.log("ERROR", err.message);
});


// ova e za da ne se pojavuva error findAndUpdate();
mongoose.set('useFindAndModify', false);





//  kometar posle mojot update za mongoDB

app.use(bodyParser.urlencoded({extended: true}));


// app.set('views', path.join(__dirname, '/views'));


app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));

// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});


app.use("/", indexRoutes);
app.use("/mai4ki", campgroundRoutes);
app.use("/mai4ki/:id/comments", commentRoutes);



app.get('/send', (req, res)=>{
    res.render('contact');
})

// Email
app.post('/send', (req, res) => {
    const output = `
      <p>You have a new contact request</p>
      <h3>Contact Details</h3>
      <ul>  
        <li>Name: ${req.body.name}</li>
        <li>Company: ${req.body.company}</li>
        <li>Email: ${req.body.email}</li>
        <li>Phone: ${req.body.phone}</li>
      </ul>
      <h3>Message</h3>
      <p>${req.body.message}</p>
    `;
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'mail.ristomanova.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
          user: 'maicka@ristomanova.com', // generated ethereal user
          pass: 'maicka1234'  // generated ethereal password
      },
      tls:{
        rejectUnauthorized:false
      }
    });
  
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Mai4ka" <maicka@ristomanova.com', // sender address
        to: 'c.dimkooo@gmail.com', // list of receivers
        subject: 'Node Contact Request', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };
  
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  
        res.render('contact', {msg:'Email has been sent'});
    });
    });
// Email End


app.listen(3000 || process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});