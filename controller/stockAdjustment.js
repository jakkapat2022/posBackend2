const { Adjustment } = require('../services/StockAdjustment.js')

const createAdjustment = async (req,res) => {

    const { id_adjust, pdt_id, pdt_name , pdt_stock , currentStock , pdt_price } = req.body;

    try {
        const createAdj = await Adjustment.create({
            id_adjust,
            pdt_id,
            pdt_name,
            pdt_stock,
            currentStock,
            pdt_price
        })

        return res.status(201).json(createAdj)
    } catch (error) {
        return res.status(500).json({success: false, error: error?.message})
    }
}

const GetChild = async (req,res) => {
    const { id_adjust } = req.body;
    try {
        const results = await Adjustment.getChild({
            id_adjust
        }) 
        return res.status(201).json(results)
    } catch (error) {
        return res.status(500).json({success: false, error: error?.message})
    }
}

const getAdjustment = async (req,res) => {
    try {
        const results = await Adjustment.get({})
        return res.status(201).json(results)
    } catch (error) {
        return res.status(500).json({success: false, error: error?.message})
    }
}

module.exports = { createAdjustment , GetChild , getAdjustment}