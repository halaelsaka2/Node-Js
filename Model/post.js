var mongoose = require("mongoose");
const User = require('../Model/users');
const _ = require('lodash')

const schema = new mongoose.Schema({
  userId:{
      type:mongoose.ObjectId,
      required:true,
      ref:'User'
  },
  title: {
    type: String,
    minlength: 10,
    maxlength: 20,
  },

  body: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 500,
  },
  tags: [{ type: String, maxlength: 10 }],  
},{
  timestamps:true,
  toJSON:{
    transform:doc=>{
      return _.pick(doc,["id","userId","body","title"])
    }
  }
});

const Post = mongoose.model("Post", schema);

module.exports = Post;
