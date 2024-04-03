const { saveStock ,createStockProduct , readStockProduct , darftSaveStock , getallStock} = require("../services/Stock.js");

const CreateStockProduct = async (req,res) => {
    const { bill_name,pdt_id,pdt_name,pdt_stock,pdt_unit,pdt_unitcost } = req.body
    console.log(req.body)
    try {
        const create = await createStockProduct.post({
            bill_name,
            pdt_id,
            pdt_name,
            pdt_stock,
            pdt_unit,
            pdt_unitcost
        })

        return res.status(201).json(create)
    } catch (error) {
        return res.status(500).json({err: error?.message})
    }
}

const ReadStockProduct = async (req,res) => {
    const ID = req.body.ID
    try {
        const getResult = await readStockProduct.get({
            ID:ID
        })
        return res.status(200).json(getResult)
    } catch (error) {
        return res.status(500).json({err: error?.message})
    }
}

const SaveDaftStock = async (req,res) => {
    const { id_stock,date,dealer,statu='ฉบับร่าง'} = req.body
    try {
        const responseResult = await darftSaveStock.post({
            id_stock,
            date,
            dealer,
            statu
        })
        return res.status(200).json(responseResult)
    } catch (error) {
        return res.status(500).json({err: error?.message})
    }
}

const DeleteListStock = async (req,res) => {
    const id = req.params.id
    //console.log(ID)
    try {

        const responseResult = await darftSaveStock.delete({
            id
        })
        return res.status(200).json(responseResult)
    } catch (error) {
        return res.status(500).json({err: error?.message}) 
    }
}

const GetallStock = async (req,res) => {
    try {
        const reult = await getallStock.post({});

        return res.status(200).json(reult)
    } catch (error) {
        return res.status(500).json({err: error?.message}) 
    }
}

const SaveStock = async (req,res) => {
    const { id_stock , date , dealer} = req.body
    
    try {
        console.log(date,dealer,id_stock)
        if(id_stock == undefined || date == undefined || dealer == undefined) return res.status(200).json({message:'กรุณาใส่ค่าให้ครบ'})
        const checkList = await saveStock.post({
            id_stock:id_stock,
            date: date,
            dealer: dealer
        })

        return res.status(200).json(checkList)
    } catch (error) {
        return res.status(500).json({err: error?.message}) 
    }
}

const DeleteStock = async (req,res) => {
    const { id_stock ,idbill } = req.query 
    try {
        console.log(req.query)
        const responseResult = await saveStock.delete({
            id_stock
        })

        return res.status(200).json();
    } catch (error) {
        return res.status(500).json({err: error?.message}) 
    }
}

module.exports = {DeleteStock , SaveStock ,GetallStock , CreateStockProduct , ReadStockProduct , SaveDaftStock , DeleteListStock}