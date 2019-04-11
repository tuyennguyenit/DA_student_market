var mongoose= require("mongoose");
var Schema= mongoose.Schema;
 
var itemSchema=new Schema({
  noiDungBaoCao:String,
  id_TinDang:String,
  sDT:String,
  email:String,
  trangThai:String, 
  tieuDe:String
});
 
var items= mongoose.model("baocaotins",itemSchema);//2.Todos:đổi thành tên bảng
module.exports=items
 
 
 
