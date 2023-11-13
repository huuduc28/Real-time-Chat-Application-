const Account = require('../models/account');
const bcrypt = require('bcrypt')
const crypto = require('crypto');

class Accounttroller {
    //Comment path and method to use this function
    // GET: /
    async renderLogin(req, res) {
        if (req.session.user) {
            return res.redirect('/')
        }
        const error = req.flash('error') || ''
        const email = req.flash('email') || ''
        const password = req.flash('password') || ''
        res.render('Login', { layout: false, error, email, password })
    }

    async googleAuthCallback(req, res) {
        try {
            const { id, displayName, photos, status } = req.user;
            let arrayAccounts = []
            arrayAccounts = await Account.find({ _id: id }).limit().lean()
            let newUser = {
                _id: id,
                fullName: displayName,
                avatar: photos[0].value,
                status: true,
            };
            //console.log(arrayAccounts.length)
            if (arrayAccounts.length >= 1) {
                // đã tồn tại
                req.session.user = newUser;
                req.user = newUser
                return res.redirect('/');
            } else {
                //thực hiện tạo account
                let accounts = new Account(newUser)
                await accounts.save()
                req.session.user = newUser;
                req.user = newUser
                return res.redirect('/');
            }
        }
        catch (err) {
            console.log(err.message)
            return res.status(500).json({ code: 2, message: err.message })
        }
    }

    async Logout(req, res) {
        req.user = null
        req.session.destroy()
        res.redirect('/account/login')
    }
    // Đăng nhập bằng tài khoản
    async LoginAccount(req, res) {
        try {
            const { email, password } = req.body;
            let arrayAccounts = await Account.find({ email: email }).limit().lean()
            if (arrayAccounts.length >= 1) {
                const hashed = arrayAccounts[0].password
                const match = bcrypt.compareSync(password, hashed)
                if (match) {
                    delete arrayAccounts[0].password
                    let user = arrayAccounts[0]
                    req.session.user = user
                    return res.redirect('/')

                } else {
                    req.flash('error', 'Sai Email hoặc mật khẩu')
                    req.flash('email', email)
                    req.flash('password', password)
                    return res.redirect('/account/login')
                }
            } else {
                req.flash('error', 'Email không tồn tại')
                req.flash('email', email)
                req.flash('password', password)
                return res.redirect('/account/login')
            }
        }
        catch (err) {
            console.log(err.message)
            return res.status(500).json({ code: 2, message: err.message })
        }
    }
    async renderRegister(req, res) {
        const error = req.flash('error') || ''
        const fullName = req.flash('fullName') || ''
        const email = req.flash('email') || ''
        const password = req.flash('password') || ''
        res.render('register', { layout: false, error, email, password, fullName })
    }
    async RegisterAccount(req, res) {
        try {
            const { fullName, email, password, repassword } = req.body; s
            let arrayAccounts = await Account.find({ email: email }).limit().lean()
            if (arrayAccounts.length >= 1) {
                // kiểm tra email
                req.flash('error', 'Email đã tồn tại')
                req.flash('fullName', fullName)
                req.flash('email', email)
                req.flash('password', password)
                return res.redirect('/account/register')
            } else {
                if (repassword != password) {
                    req.flash('error', 'Mật khẩu không trùng khớp')
                    req.flash('fullName', fullName)
                    req.flash('email', email)
                    req.flash('password', password)
                    return res.redirect('/account/register')
                } else {
                    // sử lý dữ liệu
                    const hashed = bcrypt.hashSync(password, 10)
                    const timestamp = Date.now().toString();
                    const random = Math.random().toString();
                    const id = crypto.createHash('sha1').update(timestamp + random).digest('hex');
                    let newUser = {
                        _id: id,
                        fullName: fullName,
                        avatar: 'https://antimatter.vn/wp-content/uploads/2022/11/anh-avatar-trang-fb-mac-dinh.jpg',
                        status: true,
                        email: email,
                        password: hashed
                    };
                    let accounts = new Account(newUser)
                    await accounts.save()
                    return res.redirect('/account/login')
                }
            }
        }
        catch (err) {
            console.log(err.message)
            return res.status(500).json({ code: 2, message: err.message })
        }
    }
}

module.exports = new Accounttroller();