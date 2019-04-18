
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var folderSchema = new Schema({
    id_UserGui:String,
    id_UserNhan:String,
    nameUserGui:String,
    nameUserNhan:String,
    tieuDe:String,
    noiDung:String,
    thoigianGui:String,
    thoiGianDoc:String,
    daXoa1:String,  
    daXoa2:String  
});



var Folder = mongoose.model('mails', folderSchema);


module.exports = Folder;