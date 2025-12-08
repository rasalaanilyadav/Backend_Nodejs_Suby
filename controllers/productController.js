const path = require("path");
const Product = require("../models/product");
const multer = require("multer");
const Firm = require("../models/Firm");
const { error } = require("console");

// MULTER STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// ADD PRODUCT CONTROLLER
const addProduct = async (req, res) => {
  try {
    const { productName, price, category, bestseller, description } = req.body;
    const image = req.file ? req.file.filename : null;

    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);

    if (!firm) {
      return res.status(404).json({ error: "No firm found" });
    }

    const product = new Product({
      productName,
      price,
      category,
      bestSeller: bestseller,
      description,
      image,
      firm: firm._id,
    });

    const savedProduct = await product.save();

    firm.products.push(savedProduct);
    await firm.save();

    res.status(200).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


    const getProductsByFirm=async(req,res)=>{
    try {
    const firmId=req.params.firmId;
    const firm=await Firm.findById(firmId).populate("products");


    if(!firm){
    return res.status(404).json({error:"No firm found"});
    }

    const restaurantName=firm.firmName;

    const products=await Product.find({firm:firmId});
    res.status(200).json({restaurantName,products});
      } catch (error) {
        console.error(error);
        res.status(500).json({error:"Internal server error"})

      }
    }

const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.productId;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });

  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



// EXPORT CORRECTLY
module.exports = {
  uploadImage: upload.single("image"),
  addProduct,
  getProductsByFirm,
  deleteProductById
};

 