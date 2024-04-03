const { getTotalBusiness , getTotalBySelected } = require('../services/BusinessProfits.js')

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
    const { start ,end} = req.body;
    try {
        const results = await getTotalBySelected.income({
            start,end
        });
        return res.status(200).json(results)
    } catch (error) {
        return res.status(500).json({success: false , error:error?.message})
    }
}

module.exports = { GetTotalBusiness , GetTotalBySelected}