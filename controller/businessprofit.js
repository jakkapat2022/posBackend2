const { getTotalBusiness , getTotalBySelected , getTotalProductCount } = require('../services/BusinessProfits.js')

const GetTotalBusiness = async(req,res) =>{
    const { start ,end} = req.body;
    try {
        
        const income = await getTotalBusiness.income({
            start,end
        })

        const cost = await getTotalBusiness.const({
            start,end
        })

        const results = {
            income,
            cost,
            profit: (income.total - cost.total).toFixed(2)
        }

        return res.status(200).json(results)
    } catch (error) {
        return res.status(500).json({success: false , error:error?.message})
    }
}

const GetTotalBySelected = async (req,res) => {
    const { start ,end ,type} = req.body;
    try {
        const results = await getTotalBySelected.income({
            start,end,type
        });
        return res.status(200).json(results)
    } catch (error) {
        return res.status(500).json({success: false , error:error?.message})
    }
}

const GetLasttestBill = async (req,res) => {
    try {
        const results = await getTotalBusiness.lasttestBill({})

        return res.status(200).json(results)
    } catch (error) {
        return res.status(500).json({success: false , error:error?.message})
    }
}

const GetProductCount = async (req,res) => {
    const { start ,end ,type} = req.body;
    try {
        const results = await getTotalProductCount.getCount({
            start,end,type
        })

        return res.status(200).json(results)
    } catch (error) {
        return res.status(500).json({success: false , error:error?.message})
    }
}

module.exports = { GetTotalBusiness , GetTotalBySelected , GetLasttestBill , GetProductCount}