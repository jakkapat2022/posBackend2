const { ProductStockBills , stockBillProduct , products } = require('../models/index');

const getallStock = {
    post: ({}) => new Promise (async(resolve,reject) => {
        try {
            const result = await ProductStockBills.findAndCountAll({})

            resolve(result?.rows)
        } catch (error) {
            reject(error)
        }
    })
}

const createStockProduct = {
    post:({bill_name,pdt_id,pdt_name,pdt_stock,pdt_unit,pdt_unitcost}) => new Promise (async (resolve,reject) => {
        try {
            const created = await stockBillProduct.create({
                id_stock: bill_name,
                pdt_id: pdt_id,
                pdt_name: pdt_name,
                stock: pdt_stock,
                unit: pdt_unit,
                unitcost: pdt_unitcost,
                totalcost: (pdt_stock * pdt_unitcost).toFixed(2)
            })
            

            resolve(created)
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

const readStockProduct = {
    get: ({ID}) => new Promise (async(resolve,reject) => {
        try {
            const geted = await stockBillProduct.findAndCountAll({
                where:{
                    id_stock: ID
                }
            })

            resolve(geted)
        } catch (error) {
            reject(error)
        }
    })
}

const darftSaveStock = {
    post: ({id_stock,date,dealer,statu}) => new Promise (async(resolve,reject) => {
        try {
            const findChildStock = await stockBillProduct.findAndCountAll({
                where: {
                    id_stock: id_stock
                }
            })

            let total = 0.00;

            if(findChildStock){
                for(let i = 0; i < findChildStock.count; i++){
                    total = total + findChildStock.rows[i].totalcost
                }
            }

            const checkDarft = await ProductStockBills.findOne({
                where:{
                    id_stock:id_stock
                }
            })

            if(checkDarft){
                const updateDarft = await ProductStockBills.update({
                    dealer:dealer,
                    date:date,
                    total: total
                },{
                    where:{
                        id_stock:id_stock
                    }
                })

                return resolve({update: 'success' , updateDarft})
            }else{
                const saveDarf = await ProductStockBills.create({
                    id_stock: id_stock,
                    date:date,
                    dealer:dealer,
                    status:statu,
                    total:total
                })

                return resolve({create: 'success' , saveDarf})
            }
            
            
            resolve(saveDarf)
        } catch (error) {
            reject(error)
        }
    }),

    delete: ({id}) => new Promise (async(resolve,reject) => {

        try {
            const res = await stockBillProduct.destroy({
                where:{
                    id : id
                }
            })

            resolve(res)
        } catch (error) {
            reject(error)
        } 
    })
}

class updateProductStock{
    constructor(product){
        this.product = product
    }

    async updatedStockProduct(){
        for(let i = 0; i < this.product.count; i++){
            //console.log(this.product.rows[i].pdt_name)
            const receive = await products.findOne({
                where:{
                    id: this.product.rows[i].pdt_id
                }
            })

            await products.update({
                pdt_stock : receive.pdt_stock + this.product.rows[i].stock
            },{
                where:{
                    id: this.product.rows[i].pdt_id
                }
            })
        }
    }

    async updateUndoStockProduct(){
        for(let i = 0;i < this.product.count; i++){
            const receive = await products.findOne({
                where:{
                    id: this.product.rows[i].pdt_id
                }
            })

            await products.update({
                pdt_stock : receive.pdt_stock - this.product.rows[i].stock
            },{
                where:{
                    id: this.product.rows[i].pdt_id
                }
            })
        }
    }

    async deleteListbill(){
        for(let i = 0;i < this.product.count; i++){
            const deleting = await stockBillProduct.destroy({
                where:{
                    id_stock : this.product.rows[i].id_stock
                }
            })
        }
    }
}

const saveStock = {
    post: ({id_stock,date,dealer,statu}) => new Promise (async(resolve,reject) => {
        try {
            const checkListinStock = await stockBillProduct.findAndCountAll({
                where:{
                    id_stock: id_stock
                }
            })
            
            //console.log(checkListinStock)
            if(checkListinStock.count < 1) return resolve({message:'please add a list'})

            let = total = 0.00
            for(let i = 0; i < checkListinStock.count; i++){
                total = total + checkListinStock.rows[i].totalcost
            }

            const checkList = await ProductStockBills.findOne({
                where: {
                    id_stock: id_stock
                }
            })

            const product = new updateProductStock(checkListinStock);
            

            if(!checkList){
                const created = await ProductStockBills.create({
                    id_stock: id_stock,
                    date: date,
                    dealer: dealer,
                    status: 'สำเร็จ',
                    total: total,
                })
                product.updatedStockProduct();

               //return resolve({message:'created success.'})
            }else{
                const updated = await ProductStockBills.update({
                    date:date,
                    dealer: dealer,
                    total: total,
                    status: 'สำเร็จ'
                }, {
                    where:{ id_stock : id_stock }
                })
                product.updatedStockProduct();
                //return resolve({message:'updated success.'})
            }


            resolve({message:'success'})
        } catch (error) {
            reject(error)
        }
    }),

    delete: ({id_stock}) => new Promise (async(resolve,reject) => {
        try {
            const checkListinStock = await stockBillProduct.findAndCountAll({
                where:{
                    id_stock: id_stock
                }
            })

            const product = new updateProductStock(checkListinStock);

            await ProductStockBills.destroy({
                where:{
                    id_stock:id_stock
                }
            })
            await product.deleteListbill();
            await product.updateUndoStockProduct();

            resolve({message: 'success to delete'})
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {saveStock , createStockProduct, readStockProduct , darftSaveStock , getallStock}