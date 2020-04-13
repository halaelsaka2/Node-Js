var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/MongoDB', {useNewUrlParser: true}).then(()=>{
    console.log("connect to mongoDB successfully")
})
.catch((error)=>{
    console.error(error);
});




