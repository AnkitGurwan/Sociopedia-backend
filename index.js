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

const corsOptions = {
  origin: "https://sociopediaweb-frontend.vercel.app" || "http://localhost:3000", 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions)); 

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "https://sociopediaweb-frontend.vercel.app");
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT , PATCH"
//   );
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
// });
// app.use(cors({
//     origin: 'https://sociopediaweb-frontend.vercel.app'
// }));
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
