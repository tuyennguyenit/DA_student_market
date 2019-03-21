var mongoose= require("mongoose");
var Schema= mongoose.Schema;
 
var itemSchema=new Schema({
   tenDMCon: String,
   tenDMCha:String,
   moTa:[{moTa:String}]
});
 
var items= mongoose.model("dm_cons",itemSchema);
module.exports=items
 
 
 
