require('dotenv').config();

const express = require('express');
const session = require('express-session');
const bodyparser = require('body-parser');
const expresslayouts = require('express-ejs-layouts');
const user = require('./models/user');
const LevelStore = require('level-session-store')(session);
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));

app.set('trust proxy', 1);
app.use(session({
    store: new LevelStore(),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000
    }
}));

app.use(async(req,res,next) => {
    res.locals.link = req.url;
    if(req.session && req.session.userid){
        let my = await user.findOne({_id:req.session.userid});

        if(my) {
            req.user = my;
            res.locals.user = my;
        }else{
            req.session.destroy();
        }
    }
    next();
})

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.use('/public/',express.static('public'));

app.set('view engine','ejs');
app.use(expresslayouts);
app.set('layout','layouts/main');

const IndexRouter = require('./routes/index');
const PostsRouter = require('./routes/posts');
const UsersRouter = require('./routes/users');

app.use('/',IndexRouter);
app.use('/posts/',PostsRouter);
app.use('/users/',UsersRouter);

//require('./util/enablerouters')(app);

let PORT = process.env.PORT || 3000;
require('./util/db').then(() => app.listen(PORT,() => console.log(`App listening on port ${PORT}`)));
