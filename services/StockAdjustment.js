const { StockAdjustment , StockAdjustmentChildren } = require('../models/index');
const stockadjustmentchildren = require('../models/stockadjustmentchildren');

const Adjustment = {
    create: ({id_adjust,pdt_id,pdt_name,pdt_stock,currentStock,pdt_price}) => new Promise (async(resolve,reject) => {
        try {
            let lost = 0;
            let more = 0;
            if(pdt_stock > currentStock){
                lost = (pdt_stock - currentStock) * pdt_price
            }else{
                more = (currentStock - pdt_stock) * pdt_price
            }
            

            const checkName = await StockAdjustment.findOne({
                where: {
                    name: id_adjust
                }
            })

            const checkChildren = await StockAdjustmentChildren.findOne({
                where:{
                    id_adjust : id_adjust,
                    pdt_id: pdt_id
                }
            })

            if(!checkChildren){
                const children = await StockAdjustmentChildren.create({
                    id_adjust,
                    pdt_id : pdt_id,
                    pdt_name: pdt_name,
                    pdt_stock,
                    current_stock : currentStock,
                    pdt_price
                })
            }else{
               return resolve('noadmore')
            }

            const childrenFind = await StockAdjustmentChildren.findAndCountAll({
                where:{
                    id_adjust:id_adjust
                }
            })

            let somelost = 0;
            let moreCost = 0;
            //console.log(childrenFind)
            for(let i = 0; i < childrenFind.count; i++){
                if(childrenFind.rows[i].pdt_stock < childrenFind.rows[i].current_stock){
                    let total = childrenFind.rows[i].current_stock - childrenFind.rows[i].pdt_stock
                    moreCost = moreCost + (total * childrenFind.rows[i].pdt_price)
                }else{
                    let total = childrenFind.rows[i].pdt_stock - childrenFind.rows[i].current_stock
                    somelost = somelost + (total * childrenFind.rows[i].pdt_price)
                }
                
            }

            console.log("somelost:" ,somelost)
            console.log("morecost:" ,moreCost)


            if(checkName){
                await StockAdjustment.update({
                    lostCost: somelost,
                    moreCost: moreCost
                },{
                    where:{
                        id:checkName.id
                    }
                })
            }else{
                await StockAdjustment.create({
                    name:id_adjust,
                    lostCost: lost,
                    moreCost: more,
                    status: 'ฉบับร่าง'
                })
            }

            resolve ('')
        } catch (error) {
            reject(error)
        }
    }),

    getChild:({id_adjust}) => new Promise (async(resolve,reject) => {
        try {
            const result = await StockAdjustmentChildren.findAndCountAll({
                where:{
                    id_adjust
                }
            })

            resolve(result)
        } catch (error) {
            reject(error)
        }
    }),

    get:({}) => new Promise (async(resolve,reject) => {
        try {
            const results = await StockAdjustment.findAll();

            resolve(results)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = { Adjustment }