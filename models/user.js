
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: String,
  password: String,
  name:String,
  avatar:String,
  diaChi:String,
  sDT:String,
  ngaySinh:String,
  gioiTinh:String,
  loaiTaiKhoan:String,
  trangThai:String
});


var User = mongoose.model('User', userSchema);

module.exports = User;