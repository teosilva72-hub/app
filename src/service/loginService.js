require('dotenv/config');
const axios = require('axios');

module.exports = new class Controller {

    async postLogin(data) {
        if (data.email == '' || data.email == undefined) return false;
        else if (data.password == undefined || data.password == '') return false;
        else return true;
    }

    async access(data) {
        try {
            
            const res = await axios.post(`${process.env.host}/login`, data);
            return res.data
        }catch(error){
            return error;
        }
        
    }
}