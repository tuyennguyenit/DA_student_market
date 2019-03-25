var mongoose= require("mongoose");
var Schema= mongoose.Schema;
 
var itemSchema=new Schema({
   email_User: String,
   id_TinDangTheoDoi:String
});
 
var items= mongoose.model("tintheodois",itemSchema);
module.exports=items
 
 
 
