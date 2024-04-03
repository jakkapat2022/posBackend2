const { login, register ,getUser } = require('../services/auth/user.js');

const user_login = async (req,res) => {
    const { User , password } = req.body;

    try {
        const Login = await login.post({
            User,
            password
        })

        return res.status(200).json(Login)
    } catch (error) {
        return res.status(500).json({error: error?.message})
    }
}

const user_register = async (req,res) => {
    const { User , password , name , email } = req.body;
    console.log(req.body)
    if(!User || !password || !email || !name) return res.status(200).json({message: 'Please enter value'});
    try {
        const regis = await register.post({
            User,
            password,
            name,
            email
        })

        return res.status(200).json(regis)
    } catch (error) {
        return res.status(500).json({error: error?.message})
    }
}
const user_logout = async (req,res) => {
    req.session.userId = null;
    req.session.user = null;

    return res.status(201).json({message: 'logout success'})
}

const user_get = async (req,res) =>{

    try {
        const auth = await getUser.get({
            User: req.user.user
        });
        console.log(auth)
        return res.status(200).json(auth)
    } catch (error) {
        return res.status(500).json({error: error?.message})
    }
}

const adminLogin = async(req,res) => {

    try {
        const auth = await login.adminPost({
            User: req.user.user
        });

        return res.status(200).json(auth)
    } catch (error) {
        return res.status(500).json({error: error?.message})
    }
}

module.exports = { user_login , user_get , user_logout , user_register ,adminLogin}