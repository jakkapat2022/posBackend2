const { user } = require('../../models/index');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const login = {
    adminPost: ({User}) => new Promise (async(resolve,reject) => {
        try {
            const check = await user.findOne({
                where:{
                    user:User
                }
            })

            const token = jwt.sign({ user:check?.user , level:check?.level }, process.env.TOKEN_KEY, { expiresIn: '24h' });
            if(check.level == 1) return resolve({token:token})
            
            resolve({success: false})
        } catch (error) {
            reject(error)
        }
    }),
    post: ({User,password}) => new Promise (async(resolve,reject) => {
        try {
            const lg = await user.findOne({ 
                where: {
                    user: User
                }})
            if(!lg){
                return resolve({message: 'user no data'})
            }

            const match = await bcrypt.compare(password, lg.password);
            
            if(!match){
                return resolve({message: 'password is wrong', token:null})
            }
            const token = jwt.sign({ user:lg?.user }, process.env.TOKEN_KEY, { expiresIn: '24h' });

            const res = {
                id : lg?.user,
                name : lg?.name,
                email : lg?.email,
                level : lg?.level
            }

            resolve({res,token , message: 'login success'})
        } catch (error) {
            reject(error)
        }
    })
}

const getUser = {
    get:({User}) => new Promise (async(resolve,reject) => {
        try {
            const getuser = await user.findOne({
                where: {
                    user : User
                }
            })

            const data = {
                id : getuser?.user,
                name : getuser?.name,
                email : getuser?.email,
                level : getuser?.level
            }
            
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const register = {
    post: ({User,password, name ,email}) => new Promise (async(resolve,reject) => {
        try {
            const check_user = await user.findOne({ where: { user: User}});
            if(check_user) return resolve({message: 'User alredy exit'});

            const hashPassword = await bcrypt.hash(password,10);
            const regis = await user.create({
                user: User,
                password: hashPassword,
                name: name,
                email: email,
                level: 0
            })

            const token = jwt.sign({ user:regis?.user }, process.env.TOKEN_KEY, { expiresIn: '24h' });

            const res = {
                id : regis?.user,
                email : regis?.email,
                name : regis?.name,
                level : regis?.level
            }

            resolve({res,token , message: 'regis success'})
        } catch (error) {
            reject(error)
        }
    }) 
}

module.exports = {login , register ,getUser}