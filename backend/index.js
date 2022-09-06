require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const {checkuser} = require('./util/checkers');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(cors({
    credentials:true,
    origin:process.env.ORIGIN_URL
}))

app.use(morgan('short'));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

const AuthRouter = require('./routes/auth');
const UsersRouter = require('./routes/users');
const PostsRouter = require('./routes/posts');
const MessagesRouter = require('./routes/messages');

app.use(checkuser);

app.use('/api/auth/',AuthRouter);
app.use('/api/users/',UsersRouter);
app.use('/api/posts/',PostsRouter);
app.use('/api/messages/',MessagesRouter);

let PORT = process.env.PORT || 3000;
require('./util/db').then(() => app.listen(PORT,() => console.log(`Server started on port ${PORT}`)));
