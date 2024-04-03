const { postBill , 
        postBill_product , 
        getBill_product , 
        bill_delete ,
        getCall_bill,
        updateStatus  } = require('../services/SalesSystem.js')
const { update_stock } = require('../services/Product.js');

const getAll = async (req,res) => {
    try {
        const data = await getCall_bill.get();
        return res.status(201).json(data)
    } catch (error) {
        return res.status(500).json({success: false , error:error?.message})
    }
}


const getBills_product = async (req,res) => {
    const { bill_id } = req.query
    try {
        const data = await getBill_product.post({
            bill_id : bill_id
        });
        
        return res.status(201).json(data)
    } catch (error) {
        return res.status(500).json({success: false , error:error?.message})
    }
}

const updateStatusBill = async (req,res) => {
    const { bill_id , status } = req.body
    try {
        const data = await updateStatus.post({
            bill_id : bill_id,
            status : status
        })

        return res.status(201).json(data)
    } catch (error) {
        return res.status(500).json({success : false , error: error?.message})
    }
}

const postBills = async (req, res) => {
    const body = req.body.billname
    const count = req.body.count
    console.log(req.body)
    try {
        const data = await postBill.post({
            name: body,
            pdt_count: count 
        })
        return res.status(201).json({success: true , data})
    } catch (error) {
        return res.status(500).json({success: false , error:error?.message})
    }
}

const postBills_product = async (req, res) => {
    //const id = req.body.id
    const bill_id = req.body.billname
    const id_pdt = req.body.id_pdt
    const name = req.body.name
    const barcode = req.body.barcode
    const price = req.body.price
    //console.log(req.body)
    try {

        const data = await postBill_product.post({
            bill_id: bill_id,
            id_pdt: id_pdt,
            name: name,
            barcode: barcode,
            price: price
        })

        const update = await update_stock.subtraction({
            id:id_pdt
        })

        return res.status(201).json({success: true , update})
    } catch (error) {
        return res.status(500).json({success: false , error:error?.message})
    }
}

const deleteBill_product = async (req, res) => {
    const id = req.params.id
    const bill_id = req.params.billId
    const pdt_id = req.params.pdt_id
    console.log(req.params)
    try {
        const data = await bill_delete.delete({
            id: id,
            bill_id: bill_id,
            pdt_id: pdt_id
        })

        const add = await update_stock.addition({
            id:pdt_id
        })

        return res.status(201).json({success: true , data})
    } catch (error) {
        return res.status(500).json({success: false , error:error?.message})
    }
}


module.exports = { postBills , postBills_product ,getBills_product , deleteBill_product , getAll , updateStatusBill }