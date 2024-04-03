const { darftBill , darftBill_product ,darftBill_product_stack } = require('../models/index');

const postBill = {
    post : ({ name , pdt_count}) => new Promise (async(resolve,reject) => {
        try {

             //เซ็คชื่อ productซ้ำ
            //const check = await darftBill.findOne({ where: {name}})
            //if(check) return reject(new Error(`name ${name} already exists`))

            const creates = await darftBill.create({
                name,
                pdt_count
            })
            resolve(creates);
        } catch (error) {
            reject(error);
        }
    })
}

const updateStatus = {
    post : ({bill_id ,status }) => new Promise (async(resolve,reject) => {
        try {
            const data = await darftBill.update({ status : status }, {
                where : {
                    name : bill_id
                }
            })
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const getCall_bill = {
    get : () => new Promise (async(resolve,reject) => {
        try {
            const data = await darftBill.findAndCountAll({
                where : {
                    status: 1
                }
            });

            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const postBill_product = {
    post : ({  bill_id , id_pdt , name , barcode , price}) => new Promise (async(resolve,reject) => {
        try {

            const check = await darftBill.findOne({ where: {name:bill_id}})
            const checkProduct = await darftBill_product_stack.findOne({ 
                where: {bill_id:bill_id,
                    id_pdt: id_pdt
                }})

            //console.log(checkProduct.value)

            if(!check){
                await darftBill.create({
                    name: bill_id,
                    status: 0,
                    total: 0.00
                })
            }else {
                await darftBill.update({ status : 2 },{ 
                    where : {
                        name: bill_id
                    }
                })
            }

            if(!checkProduct){
                await darftBill_product_stack.create({
                    bill_id,
                    id_pdt,
                    name,
                    barcode,
                    value : 1,
                    price
                })
            }else {
                await darftBill_product_stack.update({ value : checkProduct?.value + 1 },{ 
                    where : {
                        bill_id:bill_id,
                        id_pdt: id_pdt
                    }
                })
            }

            const creates = await darftBill_product.create({
                bill_id,
                id_pdt,
                name,
                barcode,
                price
            })
            resolve({success:true,creates});
        } catch (error) {
            console.log(error)
            reject(error);
        }
    })
}

const getBill_product = {

    post : ({ bill_id }) => new Promise (async(resolve,reject) => {
        try {
            const query = {}
            query.bill_id = bill_id

            const data = await darftBill_product.findAndCountAll({
                where: query
            })

            const data_stack = await darftBill_product_stack.findAndCountAll({
                where: query
            })

            let total = 0.00;

            const price = data.rows.map((value) => {
                total = total + value.price
            })

            if(total > 0){
                await darftBill.update({ total: (total).toFixed(2)}, {
                    where: { name : bill_id }
                })
            }

            const res = {
                total,
                data:data?.rows,
                data2: data_stack?.rows
            }

            for( let i = 0 ; i < res?.data?.length ; i++){
                //console.log(res.data[i].id_pdt)
                const data = await darftBill_product.findOne({
                    where: { id_pdt : res.data[i].id_pdt }
                })

                //console.log({name: data?.rows?.name , data: data})
                //console.log({data: data , i})
            }

            //console.log(res.data[1].name)
            resolve(res)

        } catch (error) {
            reject(error)
        }
    })
}

const bill_delete = {
    delete : ({ id , bill_id , pdt_id}) => new Promise (async(resolve,reject) => {
        try {

            const data = await darftBill_product.destroy({ where: { id: id} });

            const count = await darftBill_product.findAndCountAll({
                where: {
                    bill_id
                }
            })

            const checkProduct = await darftBill_product_stack.findOne({ 
                where: {
                    bill_id:bill_id,
                    id_pdt: pdt_id
                }})
            
            if(checkProduct.value == 1){
                await darftBill_product_stack.destroy({
                    where: {
                        bill_id:bill_id,
                        id_pdt: pdt_id
                    }});
            }

            if(count.count == 0){
                await darftBill.destroy({ where: { name: bill_id } });
                
            }

            if(checkProduct){
                await darftBill_product_stack.update({ value: checkProduct?.value - 1}, {
                    where: {
                        bill_id:bill_id,
                        id_pdt: pdt_id
                    }});
            }

            
            
            resolve(count.count)
        } catch (error) {
            reject(error)
        }
    })
} 

const delete_darft = {
    delete: ({ data }) => new Promise (async(resolve, reject) => {
        try {
            await darftBill.destroy({ where: {name :data?.read_bill?.name}});
            
            //console.log(data.data[0].id)
            for(let i = 0; i < data.count; i++){
                await darftBill_product.destroy({ 
                    where : { 
                        bill_id : data?.read_bill?.name,
                        id_pdt : data?.data[i]?.id_pdt 
                }});
                //console.log(del)
                //console.log(data.data[i].name)
            }

            resolve('success')
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = { postBill , postBill_product , getBill_product , bill_delete , getCall_bill , updateStatus , delete_darft }