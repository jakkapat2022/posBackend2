const { products , product_imgs , product_cateogry ,product_point } = require('../models/index')
const { Op } = require('sequelize')

const checkStockProduct = {
    get: ({id}) => new Promise (async(resolve,reject) => {
        try {
            const check = await products.findOne({
                where: {
                    id: id
                }
            })
            resolve(check)
        } catch (error) {
            reject(error)
        }
    })
}

const pointProduct = {

    getWithQuery: ({uid,page,limit,orderBy,sortBy,keyword,cateogry}) => new Promise (async(resolve,reject) => {
        try {
            const query = {
                uid: uid
            };
                
            if(cateogry){
                query.pdt_cateogry = cateogry
            }
            
            if(keyword) {
                query.pdt_name = {[Op.substring]: keyword}
                
            }

            const queries = {
                offset: (page - 1) * limit,
                limit
            }

            if(orderBy) {
                queries.order = [[orderBy, sortBy]]
            }

            const data = await product_point.findAndCountAll({
                where: query,
                ...queries
            })

            const res = {
                totalPages: Math.ceil(data?.count / limit),
                totalItems: data?.count,
                data:data?.rows
            }

            resolve(res)
        } catch (error) {
            reject(error)
        }
    }),

    get_check: ({uid , pdt_name}) => new Promise (async(resolve,reject) => {
        try {
            const check = product_point.findOne({
                where: {
                    uid,
                    pdt_name
                }
            })

            //if(check) return reject(check)
            resolve(check)
        } catch (error) {
            reject(error)
        }
    }),

    post: ({ 
            uid,
            pdt_id,
            pdt_name,
            pdt_barcode,
            pdt_cateogry,
            pdt_costP,
            pdt_cost,
            pdt_img,
            pdt_price,
            pdt_stock,}) => new Promise(async (resolve,reject) => {

                try {
                    const data = await product_point.create({
                        uid,
                        pdt_id,
                        pdt_name,
                        pdt_barcode,
                        pdt_cateogry,
                        pdt_costP : pdt_cost,
                        pdt_cost,
                        pdt_img,
                        pdt_price,
                        pdt_stock
                    })

                    resolve(data)
                } catch (error) {
                    reject(error)
                }
    })
}
const create_pdt = {

    create : ({ pdt_name,
                pdt_barcode,
                pdt_cateogry,
                pdt_costP,
                pdt_cost,
                pdt_img,
                pdt_price,
                pdt_stock,
             }) => new Promise(async (resolve , reject) => {
                try {

                    //เซ็คชื่อ productซ้ำ
                    const check = await products.findOne({ where: {pdt_name}})
                    if(check) return reject(new Error(`product ${pdt_name} already exists`))

                    const create = await products.create({
                        pdt_name,
                        pdt_barcode,
                        pdt_cateogry,
                        pdt_costP,
                        pdt_cost,
                        pdt_img,
                        pdt_price,
                        pdt_stock
                    })
                    resolve(create)
                } catch (error) {
                    reject(error)
                }
             }),

    create_img : ({ name,
                    data,
                    pdt_name,
     }) => new Promise(async (resolve , reject) => {
        try {
            const create = await product_imgs.create({
                    name,
                    data,
                    pdt_name,
            })
            resolve(create)
        } catch (error) {
            reject(error)
        }
     })
}

const get_pdt = {
    get : ({page,limit,orderBy,sortBy,keyword,cateogry}) => new Promise(async(resolve,reject) => {
        try {
            const query = {};

            if(cateogry){
                query.pdt_cateogry = cateogry
            }
            
            if(keyword) {
                query.pdt_name = {[Op.substring]: keyword}
                
            }

            const queries = {
                offset: (page - 1) * limit,
                limit
            }

            if(orderBy) {
                queries.order = [[orderBy, sortBy]]
            }

            const data = await products.findAndCountAll({
                where: query,
                ...queries
            })

            const res = {
                totalPages: Math.ceil(data?.count / limit),
                totalItems: data?.count,
                data:data?.rows
            }

            resolve(res)

        } catch (error) {
            reject(error)
        }
    })
}

const create_cateogry = {
    post: ({name , code}) => new Promise (async(resolve,reject) => {
        try {

            const check = await product_cateogry.findOne({ where: { cateogry_name: name }});
            if(check) return resolve({message: 'cateogry alredy exit'});
             
            const data = await product_cateogry.create({
                cateogry_name: name,
                cateogry_code: code
            })
            resolve(data)
        } catch (error) {
            reject(error) 
        }
    })
}

const update_addition = async (id) => {

    const prev_stock = await products.findOne({ where:{id} })
    if(prev_stock){
        const add_stock = await products.update(
            { pdt_stock: prev_stock.pdt_stock + 1 },
            { where: { id } }
        )
    }

    const prev_stockPoint = await product_point.findOne({ where:{pdt_id : id} })
    if(prev_stockPoint){
        const add_stockPiont = await product_point.update(
            { pdt_stock: prev_stock.pdt_stock + 1 },
            { where: { pdt_id: id } }
        )
    }
    
    
}

const update_subtraction = async (id) => {

    const prev_stock = await products.findOne({ where:{id} })
    if(prev_stock){
        const add_stock = await products.update(
            { pdt_stock: prev_stock.pdt_stock - 1 },
            { where: { id } }
        )
        console.log('add')
    }

    const prev_stockPoint = await product_point.findOne({ where:{pdt_id: id} })
    if(prev_stockPoint){
        const add_stock = await product_point.update(
            { pdt_stock: prev_stock.pdt_stock - 1 },
            { where: { pdt_id : id } }
        )
        console.log('add with point')
    }
}

const update_stock = {
    addition: ({id}) => new Promise (async(resolve,reject) => {
        try {
            return resolve(update_addition(id))
        } catch (error) {
            reject(error)
        }
    }),

    subtraction: ({id=idPoint ,idPoint}) => new Promise (async(resolve,reject) => {
        try {
            return resolve(update_subtraction(id));
        } catch (error) {
            reject(error)
        }
    })
}

const get_cateogry = {
    get : () => new Promise (async(resolve,reject) => {
        try {
            const data = await product_cateogry.findAll();
            resolve(data)

        } catch (error) {
            reject(error)
        }
    })
}

module.exports = { checkStockProduct, pointProduct, create_pdt , get_pdt , get_cateogry , create_cateogry ,update_stock}