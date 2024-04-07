const { bills , ProductStockBills , bills_product } = require('../models/index.js');
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
    }),

    lasttestBill: ({start,end}) => new Promise (async(resolve,reject) => {
        try {
            const result = []
            if(start && end){

            }else{
                result[0] = await bills.findAndCountAll({
                    order: [['createdAt', 'DESC']],
                    limit: 5
                });
            }

            resolve(result)
        } catch (error) {
            reject(error)
        }
    })


}

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

const getTotalProductCount = {
    getCount:({start,end,type}) => new Promise(async(resolve,reject) => {
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
                
                result[0] = await bills_product.findAndCountAll({
                    where:{
                        createdAt:{
                            [Op.between]:[start,newEndDate]
                        }
                    },
                    order: [['name', 'ASC']]
                })
            }else if(type){
                result[0] = await bills_product.findAndCountAll({
                    order: [['name', 'ASC']]
                })
            }else{
                 // เลือกวันย้อนหลัง 30 วัน
                 const cuurentData = new Date(Date.now())
                 const thirtyDaysAgo = new Date()
                 thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30) //ย้อนหลัง30 วัน
 
                 //console.log("now",cuurentData)
                 //console.log(thirtyDaysAgo)
                 result[0] = await bills_product.findAndCountAll({
                     where:{
                         createdAt:{
                             [Op.between]: [thirtyDaysAgo,cuurentData] // กำหนดให้วันที่ต้องมากกว่าหรือเท่ากับ thirtyDaysAgo
                         }
                     },
                     order: [['name', 'ASC']]
                 })
            }

            for(let i = 0; i < result[0].count; i++){
                keyU.push(result[0].rows[i].name)
            }

            function removeDuplicates(arr) {
                return arr.filter((item,
                index) => arr.indexOf(item) === index);
            }
            
            resultKey.push(...removeDuplicates(keyU))

            for(let i = 0; i < resultKey.length; i++){
                objResult[resultKey[i]] = []
            }

            for(let i = 0; i < result[0].count; i++){

                for(let j = 0; j < resultKey.length; j++){

                    if(result[0].rows[i].name == resultKey[j]){
                        objResult[resultKey[j]].push(result[0].rows[i].value)
                    }
                }
            }

            //for(let i = 0; i < )
            let totalSum = {}

            for (const key in objResult) {
            if (Object.hasOwnProperty.call(objResult, key)) {
                const sum = objResult[key].reduce((acc, curr) => acc + curr, 0);
               // const value = {}
                totalSum[key] = {
                    value: sum
                };
            }
            }
            
            resolve(totalSum)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = { getTotalBusiness ,getTotalBySelected , getTotalProductCount}