var mongoose= require("mongoose");
var Schema= mongoose.Schema;
 
var itemSchema=new Schema({
    carouselIMG1:String,
    theH4:String,
    theH2:String,
    theP:String,
    theLink:String,
    theA:String,
    viTri:String

});
 
var items= mongoose.model("carousel",itemSchema);
module.exports=items
 
 
 
