// Cấu hình Google Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');


passport.use(new GoogleStrategy({
  clientID: '18504559012-6ka1r1rnq528vem4t0uu863g54urtame.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:3000/account/auth/google/callback',
},
  async function (accessToken, refreshToken, profile, done) {
    // console.log(profile)
    //sử lý dữ liệu
    return done(null, profile)
  }
));

passport.serializeUser(function (user, done) { done(null, user); });

passport.deserializeUser(function (user, done) { done(null, user); });

const googleAuthMiddleware = passport.authenticate('google', { scope: ['profile'] });

const googleAuthCallbackMiddleware = passport.authenticate('google', {
  failureRedirect: '/login'
});

module.exports = { googleAuthMiddleware, googleAuthCallbackMiddleware }