const user = require('../service/userService');
const serviceLogin = require('../service/loginService');
require('dotenv/config');
module.exports = new class Controller {

    async login(req, res) {
        let obj = {ip: process.env.host2};
        res.clearCookie("bearer");
        try {
            obj.message = 'Faça Login';
            await res.render('login',{obj});
        } catch (error) {
            await res.render('login',{obj});
            return res.status(200).json({ code: 500, message: `server error ::: ${error}` });
        }

    }

    async postLogin(req, res) {
        const data = {
            email: req.body.email,
            password: req.body.password
        }
        const check = await serviceLogin.postLogin(data);
        if(check){
            const obj = await serviceLogin.access(data);
            res.cookie('bearer', obj.data);
            if(obj.status) res.redirect('/');
            else return await res.render('login',{obj})
        }
        return res.status(200)
    }

    async logout(req, res){
        res.clearCookie("bearer");
        res.redirect('/login')
    }
}