const express = require('express');
const router = express.Router();

const AccountController = require('../controllers/AccountController');
const { googleAuthMiddleware, googleAuthCallbackMiddleware } = require('../middlewares/googleAuthentication')
router.get('/login', AccountController.renderLogin);

router.get('/auth/google', googleAuthMiddleware);
router.get('/auth/google/callback', googleAuthCallbackMiddleware, AccountController.googleAuthCallback);
router.get('/logout',AccountController.Logout);
router.post('/login',AccountController.LoginAccount);
router.get('/register',AccountController.renderRegister);
router.post('/register',AccountController.RegisterAccount);

module.exports = router;
