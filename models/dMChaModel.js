var mongoose= require("mongoose");
var Schema= mongoose.Schema;
 
var itemSchema=new Schema({
   tenDMCha: String,
   anh1:String
});
 
var items= mongoose.model("dm_chas",itemSchema);
module.exports=items
 
 
 
