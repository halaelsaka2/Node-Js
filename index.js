const express = require('express');
const userRoute = require("./routes/users");
const postRoute = require("./routes/post");
require('express-async-errors');
require("./db");
const app =express();
const port=3000;

app.use(express.json());
app.use(express.urlencoded());

app.use("/user",userRoute);
app.use("/post",postRoute);

app.use((err,req,res,next) => {
    console.log(err)
    // res.json(err)
    const statusCode= err.statusCode || 500;
    // if(err.statusCode >=500){
    //     return res.status(statusCode).json({
    //         meesage:'Something wrong',
    //         type:'INTERNAL_SERVER_ERORR',
    //         details:[]
    //     })
    // }
    res.status(statusCode).json({
        // statusCode:err.statusCode,
        meesage:err.message,
        type:err.type,
        details:err.details
    })
})

app.listen(port, () => console.log(`running at port ${port}`));