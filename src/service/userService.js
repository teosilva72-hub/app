const axios = require('axios');
module.exports = new class UserService {
    async user(data) {
        return {
            name: data.name,
            password: data.password
        }
    }

    async getUser(token){
        try{
            token = token.split('=')[1]
            const user = await axios.get(`${process.env.host}/user-logado`,{
                headers: {authorization: `Bearer ${token}`}
            });
            return user.data
        }catch(error){
            console.log(error);
            return false;
        }
    }

}