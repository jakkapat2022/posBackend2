const { connect_db ,connection } = require('../Dbmysql.js');
const { checkStockProduct , create_pdt , get_pdt , get_cateogry  ,create_cateogry , pointProduct} = require('../services/Product.js')
const fs = require('fs');

const CheckStockProduct = async(req,res) => {
    const id = req.query.id

    try {

        const check = await checkStockProduct.get({
            id
        })
        return res.status(201).json(check)
    } catch (error) {
        return res.status(500).json({success: false, error: error?.message})
    }
}

const check_point = async(req,res) => {
    const { uid , pdt_name } = req.body
    //console.log(req.body)
    try {
        const check = await pointProduct.get_check({
            uid,
            pdt_name
        })

        return res.status(201).json(check)
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, error: error?.message})
    }
}

const getProductPoint = async(req,res) => {
    const { uid , page = 1 , limit = 20 , orderBy = 'pdt_stock' , sortBy = 'desc', keyword , cateogry } = req.query;
    console.log(req.query)
    try {
        const data = await pointProduct.getWithQuery({
            uid: uid,
            page: +page ? +page : 1,
            limit: +limit ? +limit : 3,
            orderBy: orderBy,
            sortBy: sortBy,
            keyword: keyword,
            cateogry: cateogry
        })

        return res.status(201).json({success: true, data})

    } catch (error) {
        return res.status(500).json({success: false, error: error?.message})
    }
}

const post_point = async(req,res) => {
    const { 
        uid,
        pdt_id,
        pdt_name,
        pdt_barcode,
        pdt_cateogry,
        pdt_costP,
        pdt_cost,
        pdt_img,
        pdt_price,
        pdt_stock
    } = req.body;

    try {
        const post_req = await pointProduct.post({
            uid,
            pdt_id,
            pdt_name,
            pdt_barcode,
            pdt_cateogry,
            pdt_costP,
            pdt_cost,
            pdt_img,
            pdt_price,
            pdt_stock
        })

        return res.status(201).json({success: true, post_req})
    } catch (error) {
        return res.status(500).json({success: false, error: error?.message})
    }
}

const post = async (req,res) => {
    const { pdt_name,
        pdt_barcode,
        pdt_cateogry,
        pdt_costP,
        pdt_cost,
        pdt_price,
        pdt_stock
    } = req.body;

    const pdt_img = req.file?.path || 'no path';
    const pdt_img_name = req.file?.filename || 'null/null.png' ;
    
    const data_img = fs.readFileSync( __basedir + "/uploads/" + pdt_img_name) ;

    try {
        const data = await create_pdt.create({
            pdt_name,
            pdt_barcode,
            pdt_cateogry,
            pdt_costP,
            pdt_cost,
            pdt_img : pdt_img_name,
            pdt_price,
            pdt_stock
        })

        const img = await create_pdt.create_img({
            name:pdt_img_name,
            data:data_img,
            pdt_name:pdt_name
        })
    
        return res.status(201).json({success: true, data})

    } catch (error) {
        return res.status(500).json({success: false, error: error?.message})
    }
}

const get = async (req,res) => {
    const { page = 1 , limit = 30 , orderBy = 'id' , sortBy = 'desc', keyword , cateogry } = req.query;
    try {
        const data = await get_pdt.get({
            page: +page ? +page : 1,
            limit: +limit ? +limit : 3,
            orderBy: orderBy,
            sortBy: sortBy,
            keyword: keyword,
            cateogry: cateogry
        })

        return res.status(201).json({success: true, data})

    } catch (error) {
        return res.status(500).json({success: false, error: error?.message})
    }
    
}


const post_cateogry = async ( req,res) => {
    const { name , code } = req.body;
    try {
        
        const data = await create_cateogry.post({
            name,
            code
        })

        return res.status(201).json(data)
    } catch (error) {
        return res.status(500).json({success: false , error:error?.message})
    }
}

const get_cateogrys = async (req,res) => {
    try {
        const data = await get_cateogry.get();

        return res.status(201).json(data)
    } catch (error) {
        return res.status(500).json({success: false , error:error?.message})
    }
}

const get_product = (req ,res) => {
    try {
        connection.query("SELECT * FROM `productstocks`",
            (error,results,fields) => {
                if(error){
                    console.log(error)
                    return res.status(400).send()              
                }

                return res.status(201).json(results)
            });
    } catch (error) {
        console.log(error)
        return res.status(500).send()
    }
}

const getId_product = (req ,res) => {
    const id = req.params.id;
    try {
        connection.query("SELECT * FROM `productstocks` WHERE `pdt_name` = ?",
            [id],(error,results,fields) => {
                if(error){
                    console.log(error)
                    return res.status(400).send()
                }
                return res.status(201).json(results)
            });
    } catch (error) {
        console.log(error)
        return res.status(500).send()
    }
}

const create_product = async (req, res) => {
    const { pdt_name,
        pdt_barcode,
        pdt_cateogry,
        pdt_costP=0,
        pdt_cost=0,
        pdt_price=0,
        pdt_stock=0
    } = req.body;

    const pdt_img = req.file?.filename || 'null/null.png';
    const pdt_path = req.file?.path || 'no path' ;
    
    const data_img = fs.readFileSync( __basedir + "/uploads/" + pdt_img) ;

    
    try {
        connection.query(
            "INSERT INTO productstocks(pdt_name , pdt_barcode, pdt_cateogry,pdt_costP,pdt_cost,pdt_img,pdt_price,pdt_stock) VALUES(?,?,?,?,?,?,?,?)",
            [   
                pdt_name,
                pdt_barcode,
                pdt_cateogry,
                pdt_costP,
                pdt_cost,
                pdt_path,
                pdt_price,
                pdt_stock
            ],
            (error,results, fields) => {
                if(error){
                    console.log(error)
                    return res.status(400).send()
                }

                return res.status(201).json({message:"new added."})
            }
        )

        connection.query(
            "INSERT INTO productimage(pdt_name, image_name , image_data , image_mimetype) VALUES(?,?,?,?)",
            [
                pdt_name,
                pdt_img,
                data_img || 'undifind',
                req.file?.mimetype || 'undifind'
            ],() => {
                if(pdt_img != 'null/null.png'){
                    fs.writeFileSync( __basedir + "/uploads/temp/" + pdt_name + pdt_img , data_img);
                }
                //
            }
        )
    } catch (error) {
        console.log(error)
        return res.status(500).send()
    }
  
}

const update_product = async (req,res) => {
    const { pdt_name,
        pdt_barcode,
        pdt_cateogry,
        pdt_costP,
        pdt_cost,
        pdt_price,
        pdt_stock
    } = req.body;
    const id = req.params.id;

    try {
        connection.query('UPDATE `productstocks` SET `pdt_name` = ? , `pdt_barcode` = ?, `pdt_cateogry` = ? , `pdt_costP` = ?,`pdt_cost` = ?,`pdt_price` = ?,`pdt_stock` = ? WHERE `pdt_id` = ?',
            [
                pdt_name,
                pdt_barcode,
                pdt_cateogry,
                pdt_costP,
                pdt_cost,
                pdt_price,
                pdt_stock,
                id
            ], (error,results) => {
                if(error){
                    console.log(error)
                    return res.status(400).send()
                }

                return res.status(201).json({message:"succes fully to update."})
            })
    } catch (error) {
        console.log(error)
        return res.status(500).send()
    }
}

const delete_product = async (req, res) => {
    const id = req.params.id;
    try {
        connection.query('DELETE FROM `productstocks` WHERE `pdt_id` = ?',
            [id], () => {
                return res.status(201).json({message:"success fully deleted."})
            })
    } catch (error) {
        console.log(error)
        return res.status(500).send()
    }
}

module.exports = 
{   get_product , 
    getId_product , 
    create_product , 
    update_product  , 
    delete_product ,
    post ,
    get,
    get_cateogrys,
    post_cateogry,
    post_point,
    check_point,
    getProductPoint,
    CheckStockProduct
}