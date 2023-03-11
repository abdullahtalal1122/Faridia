const bodyParser = require("body-parser");
const express = require("express");
const ejs = require("ejs");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
 app.set('view engine', 'ejs');
app.use(express.static("public"));

const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/Products', { useNewUrlParser: true, useUnifiedTopology: true });

const productSchema = new mongoose.Schema({
  name: String,
  size: String,
  price: Number,
  image: String,
  category : String 
});

const Products = mongoose.model('products', productSchema);





let productArray = [];

app.post("/products", async (req, res) => {
  let category = req.body.category;
  console.log(category); // add this line to check if category is received

  category = category.charAt(0).toUpperCase() + category.slice(1);

  // Query the database to retrieve products by category
  const product = await Products.find({ category });

  productArray = product;

  res.render("products", { productArray });
});





app.get("/compose" ,(req,res) => {
  
  console.log("test");

  res.render("compose");
})

app.post("/compose", (req, res) => {
  
  let type = req.body.category;
  console.log(type);

  type = type.charAt(0).toUpperCase() + type.slice(1);
console.log(type);
  
  const newProduct = new Products({
    name: req.body.name,
    size: req.body.size,
    price: Number(req.body.price),
    image: req.body.image,
    category: type
  });

  newProduct.save()
    .then(() => {
      console.log('Product saved to database');
      res.redirect("/compose");
    })
    .catch(err => console.log(err));
});




app.get("/", (req, res) => {
  res.render("home"  );
});



app.get("/about" , (req,res) => {
  res.render("about");
})

app.get("/login" , (req,res) => {
  res.render("login");
})


app.get("/signup" , (req,res) => {
  res.render("signup");
})


app.get("/products" , (req,res) => {
  res.render("products" , {productArray : productArray});
})
 

app.listen("3000", () =>{

  console.log("server started ");

});