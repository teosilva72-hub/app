const user = require('../service/userService');
const serviceLogin = require('../service/loginService');
require('dotenv/config');
module.exports = new class Controller {

    async login(req, res) {
        let obj = {};
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
        console.log('aqui')
        res.cookie("bearer");
        res.redirect('/login')
    }
}