const express = require('express');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
require('dotenv').config()
const { connect_db ,connection } = require('./Dbmysql.js');
const cors = require('cors')
const app = express();
const port = process.env.PORT;
const middlewareUpload = require('./middleware/upload.js');
const {DeleteStock , SaveStock , CreateStockProduct , ReadStockProduct , SaveDaftStock , DeleteListStock, GetallStock } = require('./controller/stock.js')
const { commitBill ,getBill , getBillProduct } = require('./controller/bill.js')
const { user_login ,user_get , user_logout , user_register ,adminLogin } = require('./controller/user.js')
const {CheckStockProduct, get, get_product ,getId_product , create_product , update_product , delete_product ,post, get_cateogrys , post_cateogry , post_point ,check_point , getProductPoint} = require('./controller/product.js');
const { postBills , postBills_product , getBills_product , deleteBill_product ,getAll , updateStatusBill} = require('./controller/salesSystem.js')
const { createAdjustment , GetChild , getAdjustment } = require('./controller/stockAdjustment.js');
const { GetTotalBusiness ,GetTotalBySelected } = require('./controller/businessprofit.js')

require('./connect.js');
const db = require('./models/index.js');
const auth = require('./middleware/auth.js');
global.__basedir = __dirname;
connect_db();
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use('/product/img' , express.static('uploads'))
app.use(
    cors({
      credentials: true,
      origin: ["http://localhost:3000","https://bat-dev.com"],
    }),
  );

//ยูสเซอร์
app.post("/user/admin/login",auth,adminLogin);
app.post("/user/get",auth,user_get);
app.post("/user/login",user_login);
app.post("/user/logout",user_logout);
app.post("/user/register",user_register);

//ดึงข้อมูลทั้งหมด
app.get("/productstocks/get/cateogry", get_cateogrys);
app.post("/productstocks/post/cateogry", post_cateogry);
app.get("/bills/get",getAll)
app.post("/bills/getproduct", getBills_product);

//ดึงข้อมูลจาก
app.post("/productstocks/get", get);

//สร้างสินค้า
app.post("/productstocks/create", middlewareUpload.single('product'), post);
app.post("/bills/create",postBills);
app.post("/bills/add",postBills_product);
app.post("/bills/update/status" , updateStatusBill);

//บิล
app.get("/product/check/stock", CheckStockProduct);
app.post("/bills/succes",commitBill);
app.post("/bills/read",getBill);
app.post("/bills/getall/product",getBillProduct);

//ปักหมุดสินค้า
app.post("/product/point/add",post_point);
app.post("/product/point/check",check_point);
app.post("/product/point/get", getProductPoint);

//อัพเดทข้อมูล
app.put("/productstocks/update/:id", update_product);

//ลบสินค้า
app.delete("/productstocks/delete/:id", delete_product);
app.delete("/bills/delete/:billId/:id/:pdt_id",deleteBill_product);

//stockApi
app.post("/stock/create", CreateStockProduct);
app.post("/stock/get",ReadStockProduct);
app.post("/stock/add/darft",SaveDaftStock);
app.delete("/stock/delete/list/:id",DeleteListStock);
app.post("/stock/getall",GetallStock);
app.post("/stock/add", SaveStock);
app.delete("/stock/delete", DeleteStock);

//stockAdjust
app.post("/stock/adjust/create", createAdjustment);
app.post("/stock/adjust/getchild" , GetChild);
app.get("/stock/adjust/get",getAdjustment);

//dashbroad
app.post("/businessprofits/getIncome", GetTotalBusiness);
app.post("/businessprofits/getIncomeSelected", GetTotalBySelected);

app.listen(port, () => console.log("server is running on", port));
