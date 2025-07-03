// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('cloudinary').v2;
// require("dotenv").config()

// cloudinary.config({
//     cloud_name:process.env.CLOUDINARY_NAME,
//     api_key:process.env.CLOUDINARY_API_KEY,
//     api_secret:process.env.CLOUDINARY_API_SECRET
// })




// const storage= new CloudinaryStorage({
//     cloudinary:cloudinary,
//     params:{
//         folder:"images",
//         format: async (req,file)=>"png",
//         public_id:(req,file)=> file.originalname.split(".")[0]+""
//     }
// })


// const cloudinaryUploader=multer({storage:storage})

// module.exports={cloudinaryUploader}


const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'images',
    format: async (req, file) => file.mimetype.split('/')[1], // keep original format
    public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`, // avoid collision
  },
});

const cloudinaryUploader = multer({ storage });

module.exports = { cloudinaryUploader };
