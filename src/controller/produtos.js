require('dotenv/config');
const service = require('../service/userService');
module.exports = new class Produtos{

    async produtos(req, res){
        try{
            let token = req.headers.cookie;
            //token = token.split('=')[1];
            let user = await service.getUser(token);
            user = user.data;
            user = JSON.stringify(user);
            if(!token) return res.redirect('login');
            await res.render('produto');
        }catch(error){
            await res.render('produto');
        }
    }
}