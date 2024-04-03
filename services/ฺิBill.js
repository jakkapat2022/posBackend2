const { bills , bills_product , darftBill , darftBill_product ,darftBill_product_stack } = require('../models/index');
const { Op } = require('sequelize');

const billGet = {
    postClildren:({bill_id ,orderBy,sortBy , page,limit}) => new Promise (async(resolve,reject) => {
        try {

            const queries = {}


            if(orderBy) {
                queries.order = [[orderBy, sortBy]]
            }
            const getData = await bills_product.findAndCountAll({
                where: {
                    bill_id
                },...queries
            })

            const res = {
                billProductData : getData?.rows
            }

            resolve(res)
        } catch (error) {
            reject(error)
        }
    }),
    post: ({ date , uid ,orderBy,sortBy , page,limit}) => new Promise (async(resolve,reject) => {
        try {

            const query = {
                seller: uid
            }
            if(date){
                query.createdAt = {[Op.substring]: date}
            }


            const queries = {
                offset: (page - 1) * limit,
                limit
            }

            if(orderBy) {
                queries.order = [[orderBy, sortBy]]
            }

            const getData = await bills.findAndCountAll({
                where: query,
                ...queries
            })

            const res = {
                totalPages: Math.ceil(getData?.count / limit),
                totalItems: getData?.count,
                count: getData?.count,
                data: getData?.rows
            }
            resolve(res)
        } catch (error) {
            reject(error)
        }
    })
}
const close_sell = {
    post: ({bill_id , waypay , uid , Income ,change}) => new Promise (async(resolve,reject) => {

        try {

            const read_bill = await darftBill.findOne({ where: {name : bill_id} });
            const data = await bills.create({
                bill_id : bill_id,
                seller : uid,
                status : waypay,
                total : read_bill?.total,
                Income: Income,
                totalchange : change
            })
            const read_bill_product = await darftBill_product_stack.findAndCountAll({
                where: {
                    bill_id : bill_id
                }
            })

            const res = {
                count: read_bill_product?.count,
                data: read_bill_product?.rows,
                read_bill : read_bill
            }
            
            //
            

            for(let i = 0; i < res.count; i++){
                //console.log({bill_id :res.data[i].bill_id})
                
                await bills_product.create({
                    bill_id : res?.data[i]?.bill_id,
                    id_pdt : res?.data[i]?.id_pdt,
                    name : res?.data[i]?.name,
                    barcode : res?.data[i]?.barcode,
                    value : res?.data[i]?.value,
                    price : res?.data[i]?.price
                })

            }
            //console.log(read_bill.name)

            //console.log(res.count)

            //const write_bill_product = await
            
            resolve(res)
        } catch (error) {
            reject(error);
        }
        
    })
}

module.exports = { close_sell , billGet }
