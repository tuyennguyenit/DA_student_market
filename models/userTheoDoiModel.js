var mongoose= require("mongoose");
var Schema= mongoose.Schema;
 
var itemSchema=new Schema({
   email_User: String,
   id_UserTheoDoi:String,
   name:String,
   sDT:String,
   mail:String,
   id:String
});
 
var items= mongoose.model("usertheodois",itemSchema);
module.exports=items
 
 
 
