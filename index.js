const express = require('express');
const passport = require('passport');
const session = require('express-session');
const passportSteam = require('passport-steam');
const SteamStrategy = passportSteam.Strategy;
const app = express();

const port = 3001;

// Required to get data from user for sessions
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Initiate Strategy
passport.use(new SteamStrategy({
        returnURL: 'http://localhost:' + port + '/api/auth/steam/return',
        realm: 'http://localhost:' + port + '/',
        apiKey: '5B92D9E3145BEEC9265C03504ACDAF1A'
    }, function (identifier, profile, done) {
        process.nextTick(function () {
            profile.identifier = identifier;
            return done(null, profile);
        });
    }
));

app.use(session({
    secret: 'VadimYanuschik',
    saveUninitialized: true,
    resave: false,
    cookie: {
        maxAge: 3600000
    }
}));

app.use(passport.initialize());

app.use(passport.session());

// Initiate app
app.listen(port, () => {
    console.log('Listening, port ' + port);
});

app.get('/api/success', (req, res) => {
    res.json(req.user);
    console.log(req.user)
});

// Routes
app.get('/api/auth/steam', passport.authenticate('steam', {failureRedirect: '/'}), function (req, res) {
    res.redirect('/api/success')
});

app.get('/api/auth/steam/return', passport.authenticate('steam', {failureRedirect: '/'}), function (req, res) {
    res.redirect('/api/success')
});