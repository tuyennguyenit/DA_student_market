var mongoose= require("mongoose");
var Schema= mongoose.Schema;
 
var itemSchema=new Schema({
  noiDungBaoCao:String,
  id_TinDang:String,
  chiTiet:String,
  sDT:String,
  email:String,
  trangThai:String
});
 
var items= mongoose.model("baocaotins",itemSchema);//2.Todos:đổi thành tên bảng
module.exports=items
 
 
 
