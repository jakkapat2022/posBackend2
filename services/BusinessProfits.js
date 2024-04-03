const { bills , ProductStockBills } = require('../models/index.js');
const { Op } = require('sequelize')

const getTotalBusiness = {
    income:({start,end}) => new Promise(async(resolve,reject) =>{
        try {
            const result = []
            if(start && end){

                const newEndDate = new Date(end)
                newEndDate.setDate(newEndDate.getDate() + 1)

                result[0] = await bills.findAndCountAll({
                    where:{
                        createdAt: {
                            [Op.between]:[start,newEndDate]
                        }
                    }
                })
            }else{
                result[0] = await bills.findAndCountAll({})
            }

            let cash = 0.00;
            let promtpay = 0.00;
            for(let i = 0; i < result[0].count; i++){
                if(result[0].rows[i].status == 'เงินสด'){

                    cash = cash + parseFloat(result[0].rows[i].total)

                }else if(result[0].rows[i].status == 'พร้อมเพย์'){

                    promtpay = promtpay + parseFloat(result[0].rows[i].total)
                }
            }

            const res = {
                bills: result[0].count,
                cash: cash,
                promtpay: promtpay,
                total: (cash + promtpay).toFixed(2)
            }

            resolve(res)
        } catch (error) {
            reject(error)
        }
    }),

    const:({start,end}) => new Promise (async(resolve,reject) => {
        try {
            const result = []

            if(start && end){
                const newEndDate = new Date(end)
                newEndDate.setDate(newEndDate.getDate() + 1)

                result[0] = await ProductStockBills.findAndCountAll({
                    where:{
                        createdAt:{
                            [Op.between]:[start,newEndDate]
                        }
                    }
                })
            }else{
                result[0] = await ProductStockBills.findAndCountAll({})
            }

            let Cost = 0.00;
            let More = 0.00;
            for(let i = 0; i < result[0].count; i++){

                Cost = Cost + parseFloat(result[0].rows[i].total)

            }

            const res = {
                cost: Cost,
                more: More,
                total: (Cost + More).toFixed(2)
            }
            resolve(res)
        } catch (error) {
            reject(error)
        }
    })


}

const getTotalBySelected ={
    income:({start,end}) => new Promise(async(resolve,reject) => {
        try {
            const objResult = {}
            const keyU = []
            const resultKey = []
            const result = []

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
            }else{
                // เลือกวันย้อนหลัง 30 วัน
                const cuurentData = new Date(Date.now())
                const thirtyDaysAgo = new Date()
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

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
                keyU.push(`${date.getFullYear(2)}/${date.getMonth() + 1}/${date.getDate()}`)

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
                for(let j = 0;j < resultKey.length; j++){
                    if(`${date.getFullYear(2)}/${date.getMonth() + 1}/${date.getDate()}` == resultKey[j]){
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

module.exports = { getTotalBusiness ,getTotalBySelected }