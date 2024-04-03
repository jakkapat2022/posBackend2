const { close_sell , billGet } = require('../services/ฺิBill.js');
const { delete_darft } = require('../services/SalesSystem.js');

const getBillProduct = async(req,res) => {
    const { bill_id , orderBy = 'price' , sortBy = 'desc' } = req.query
    try {
        const getAllBillProduct = await billGet.postClildren({
            bill_id,
            orderBy,
            sortBy
        })

        return res.status(201).json(getAllBillProduct);
    } catch (error) {
        return res.status(500).json({success: false , error:error?.message})
    }
}

const getBill = async(req,res) => {
    const { uid , date , page = 1 , limit = 20 , orderBy = 'id' , sortBy = 'asc'} = req.query;
    try {
        const getDataBill = await billGet.post({
            uid,
            date,
            page: +page ? +page : 1,
            limit: +limit ? +limit : 3,
            orderBy,
            sortBy
        })
        return res.status(201).json(getDataBill);
    } catch (error) {
        return res.status(500).json({success: false , error:error?.message})
    }
}

const commitBill = async (req,res) => {
    const bill_id  = req.body.bill_id;
    const waypay  = req.body.waypay;
    const uid = req.body.uid;
    const change = req.body.change;
    const Income = req.body.Income;

    try {
        const data = await close_sell.post({
            bill_id : bill_id,
            waypay : waypay,
            uid: uid,
            Income: Income,
            change: change
        })
        //console.log(data.read_bill.name)
        if(data){
            const deleted = await delete_darft.delete({
                data
            })
        }

        return res.status(201).json({success: true , data: data })
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false , error:error?.message})
    }
}

module.exports = { commitBill , getBill , getBillProduct}