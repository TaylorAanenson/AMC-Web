const express = require('express');
const app = express();
const router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const verifyToken =  require ("./utils/validation");
var request = require("request");

// file-type: Detect the file type of a Buffer/Uint8Array
// multiparty: Parse http requests with content-type multipart/form-data, also known as file uploads.
const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const multiparty = require('multiparty');
const uploadFile =  require ("./utils/file_upload");

// create S3 instance
const s3 = new AWS.S3();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

const connection = mysql.createConnection({
  host: process.env.DB_HOST,

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: process.env.DB_USER,

  // Your password
  password: process.env.DB_PW,
  database: process.env.DB_DB
});

router.post("/image/upload", verifyToken, function(request, response) {
  let user_id = request.decoded._id;
  console.log("this is my user ID", user_id);

  const form = new multiparty.Form(); // parse a file upload
    form.parse(request, async (error, fields, files) => {
      if (error) throw new Error(error);
      try {
        const path = files.file[0].path; //get the file path
        const buffer = fs.readFileSync(path); //return the content of the path in buffer
        const type = fileType(buffer); //return { ext: 'png', mime: 'image/png' }
        const timestamp = Date.now().toString();
        const fileName = `dealsImages/user_id-${user_id}/${timestamp}`;
        const data = await uploadFile(buffer, fileName, type);
        return response.status(200).json(data);
      } catch (error) {
        return response.status(400).json(error);
      }
    });
})

router.post("/image/remove", verifyToken, function(request, response) {

  let params = {
    Bucket: "acceptmycrypto",
    Key: request.body.imageKey
   };

   s3.deleteObject(params, function (err, data) {
    if (data) {
        console.log("File deleted successfully");
    }
    else {
        console.log("Check if you have sufficient permissions : "+err);
    }
  });

  let user_id = request.decoded;
  console.log("imageKey", request.body.imageKey);

})

router.post("/cryptocurrency/exchange", verifyToken, async function(req, res) {
  //call coinmarketcap api to get the exchange rate
  let crypto = req.body.crypto_symbol;
  let discountPrice = parseFloat(req.body.price_in_crypto);

  let options = {
      method: "GET",
      qs: {
        symbol: crypto
      },
      headers: {
        "X-CMC_PRO_API_KEY": process.env.COINMARKET_API_KEY,
        Accept: "application/json"
      }
    }
  ;

  //use request to call coinmarketcap endpoint
  await request('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest', options, function (error, response, body) {
    if (error) {
      console.log(error);
    }
    console.log('body:', body); // Print the HTML for the Google homepage.
    let rateDate = JSON.parse(body);
    let cryptoRate = rateDate.data[crypto].quote.USD.price;
    console.log("rate", cryptoRate);
    let cryptoAmount = (discountPrice/cryptoRate).toFixed(4);
    console.log("discountPrice", discountPrice);
    console.log("amount", cryptoAmount);
    return res.status(200).json(cryptoAmount);
  });


})




// api
// router.post('/listdeal', verifyToken, function(req, res) {
//   let id = req.decoded._id;
//   //what is needed to insert into the tables?


//   if (id) { //if login


//   }
// });

module.exports = router;
