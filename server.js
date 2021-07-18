const path = require('path');
const express = require('express');
const session = require('express-session');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

const SeqeulizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
    secret: process.env.SESS_SECRET,
    cookie: {},
    resave: false,
    saveUnitialized: true,
    store: new SeqeulizeStore({
        db: sequelize
    })
};

app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
//turn on routes
app.use(routes);

//turn on connection to db and server
sequelize.sync({ force: false }).then(() =>{
    app.listen(PORT, () => console.log('Now listening'));
});
