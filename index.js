import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import database from "./config/database.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/post.js";
import { createPost } from "./controllers/post.js";
import { register } from "./controllers/auth.js";
import { verifytoken } from "./middleware/auth.js";


// Configurations 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({path:"config/.env"});
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy : "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit : "30mb" , extended : true}));
app.use(bodyParser.urlencoded({limit : "30mb" , extended : true}));

app.use(cors({
    origin: 'https://sociopediaweb-frontend.vercel.app'
}));
app.use("/assets",express.static(path.join(__dirname, 'public/assets')));

// multer configure 
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"./public/assets");
    },
    filename: function(req,file,cb){
        cb(null,file.originalname)
    }
});
const upload = multer({storage});

//Routes for resister with image
app.post("/auth/register",upload.single("picture"),register);
app.post("/posts",upload.single("picture"),createPost);

//Routes
app.use("/auth",authRoutes);
app.use("/users",userRoutes);
app.use("/posts",postRoutes);

//mongoose connection
database();

//connection
app.listen(process.env.PORT,(req,res,err)=>{
    if(err)
        console.log(err);
    else
        console.log(`Server is listening on port : ${process.env.PORT}`)
})
