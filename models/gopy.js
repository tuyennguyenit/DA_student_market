
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var folderSchema = new Schema({
   ho:String,
   ten:String,
   diaChiMail:String,
   tieuDe:String,
   gopY:String
});



var Folder = mongoose.model('gopy', folderSchema);


module.exports = Folder;