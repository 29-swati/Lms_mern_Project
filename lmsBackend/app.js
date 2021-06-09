const mongoose = require("mongoose")
const mongoostatic = require('mongoosastic')
const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require("cors")
require('dotenv').config()

//creating an instance of express
const app = express();

//my routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category')
const courseRoutes = require('./routes/course')
const subCourseRoutes = require('./routes/subcourse')
const cartRoutes = require('./routes/cart')

//DB connection
mongoose.connect('mongodb://localhost:27017/lmsDB',{
    useNewUrlParser : true,
    useUnifiedTopology :true,
    useCreateIndex: true
}).then(()=>{
    console.log('DB CONNECTED')
})


//middleware
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors({credentials:true, origin:"http://localhost:3000"}));
app.use(bodyParser.urlencoded({ extended: true }));

app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header({'Access-Control-Allow-Credentials': true})
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});

//Routes
app.use('/api',authRoutes);
app.use('/api',categoryRoutes);
app.use('/api',userRoutes);
app.use('/api',courseRoutes);
app.use('/api',subCourseRoutes);
app.use('/api',cartRoutes)

//PORT
const port = process.env.PORT || 8001;


//starting a server
app.listen(port,()=>{
    console.log(`app is running at ${port}`)
})