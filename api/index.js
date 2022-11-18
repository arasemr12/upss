require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const {checkuser} = require('./util/checkers');
const morgan = require('morgan');

const app = express();

app.set('trust proxy',true);

app.use(morgan('short'));

app.use(bodyparser.json({limit:5000}));
app.use(bodyparser.urlencoded({ extended: false, limit:5000 }));

const AuthRouter = require('./routes/auth');
const UsersRouter = require('./routes/users');
const PostsRouter = require('./routes/posts');
const MessagesRouter = require('./routes/messages');
const CategoryRouter = require('./routes/category');

app.use(checkuser);

app.get('/',(req,res) => {
    res.send("sa");
});

app.use('/auth/',AuthRouter);
app.use('/users/',UsersRouter);
app.use('/posts/',PostsRouter);
app.use('/messages/',MessagesRouter);
app.use('/category/',CategoryRouter);

module.exports = app;
require('./util/db');
