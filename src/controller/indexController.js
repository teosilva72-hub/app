const service = require('../service/userService');
const os = require('os');
const networkInfo = os.networkInterfaces();
console.log(networkInfo[0]) // objeto
module.exports = new class IndexController{

    async index(req, res){
        try{
            let token = req.headers.cookie;
            //token = token.split('=')[1];
            let user = await service.getUser(token);
            user = user.data;
            if(!token) return res.redirect('login');
            return await res.render('index', {user, ip: `${process.env.host2}:${process.env.PORT}`});
        }catch(error){
            let user = {};
            console.log(error);
            return await res.render('index', user);
        }
    }
}