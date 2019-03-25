
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var tindangSchema = new Schema({
  email_User:  String ,
  tieuDe:String,
  moTaChiTiet:String,
  anh1:String,
  dmcha:String
});

var User = mongoose.model('tindang', tindangSchema);

module.exports = User;


