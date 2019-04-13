
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var tindangSchema = new Schema({
  email_User:  String ,
  tieuDe:String,
  moTaChiTiet:String,
  anh1:String,
  anh2:String,
  anh3:String,
  dmcha:String, 
  dmCon:String,
  tinh:String,    //tinh thanh
  huyen:String,   //tinh thanh
  xa:String,      //tinh thanh
  diaChi:String,  //tinh thanh
  gia:Number,     
  loaiTinDang: String, //ban ,mua
  trangThai:String, //an hien
  daDuyet:String, //da duyet,chưa duyet
  thoiGianDang:String,
  thoiHan:String
});

var User = mongoose.model('tindang', tindangSchema);

module.exports = User;


