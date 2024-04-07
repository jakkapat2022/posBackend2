const { bills , ProductStockBills } = require('../models/index.js');
const { Op } = require('sequelize')

const getTotalBySelected ={
    income:({start,end,type}) => new Promise(async(resolve,reject) => {
        try {
            const result = []
            const objResult = {}
            const keyU = []
            const resultKey = []

            if(type == 'day'){
                type = null
            }

            // if(type){
            //     start = null
            //     end = null
            // }


            if(start && end){

                const newEndDate = new Date(end)
                newEndDate.setDate(newEndDate.getDate() + 1)
                
                result[0] = await bills.findAndCountAll({
                    where:{
                        createdAt:{
                            [Op.between]:[start,newEndDate]
                        }
                    },
                    order: [['createdAt', 'ASC']]
                })
            }else if(type){
                result[0] = await bills.findAndCountAll({
                    order: [['createdAt', 'ASC']]
                })
            }else{
                 // เลือกวันย้อนหลัง 30 วัน
                 const cuurentData = new Date(Date.now())
                 const thirtyDaysAgo = new Date()
                 thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30) //ย้อนหลัง30 วัน
 
                 //console.log("now",cuurentData)
                 //console.log(thirtyDaysAgo)
                 result[0] = await bills.findAndCountAll({
                     where:{
                         createdAt:{
                             [Op.between]: [thirtyDaysAgo,cuurentData] // กำหนดให้วันที่ต้องมากกว่าหรือเท่ากับ thirtyDaysAgo
                         }
                     },
                     order: [['createdAt', 'ASC']]
                 })
            }
            

            for(let i = 0; i < result[0].count; i++){
                let date = new Date(result[0].rows[i].createdAt)
                let key;
                // Determine the key based on the switch case
                switch (type) {
                    case 'year':
                        key = `${date.getFullYear(2)}`;
                        break;
                    case 'month':
                        key = `${date.getFullYear(2)}/${date.getMonth() + 1}`;
                        break;
                    default:
                        key = `${date.getFullYear(2)}/${date.getMonth() + 1}/${date.getDate()}`;
                        break;
                }

                keyU.push(key)

            }

            function removeDuplicates(arr) {
                return arr.filter((item,
                    index) => arr.indexOf(item) === index);
            }


            resultKey.push(...removeDuplicates(keyU))

            //console.log(resultKey.length)
            for(let i = 0; i < resultKey.length; i++){
                const key = resultKey[i];
                //console.log(resultKey[i])
                objResult[key] = []
            }

            for(let i = 0; i < result[0].count; i++){
                let date = new Date(result[0].rows[i].createdAt)
                let key;
                // Determine the key based on the switch case
                switch (type) {
                    case 'year':
                        key = `${date.getFullYear(2)}`;
                        break;
                    case 'month':
                        key = `${date.getFullYear(2)}/${date.getMonth() + 1}`;
                        break;
                    default:
                        key = `${date.getFullYear(2)}/${date.getMonth() + 1}/${date.getDate()}`;
                        break;
                }

                for(let j = 0;j < resultKey.length; j++){
                    if(key == resultKey[j]){
                        const bill = {
                            total: result[0].rows[i].total
                        }
                        objResult[resultKey[j]].push(bill)
                    }
                }
            }

            resolve(objResult)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = { getTotalBySelected }