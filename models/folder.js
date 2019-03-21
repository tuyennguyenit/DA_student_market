// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var folderSchema = new Schema({
  name: String,
  email: String,
  created: String,
  tasks: [{  tname: String,progress:String,_idUserMember:String,_idUserReviewer:String,priority:String}],
  describe:String,
  members:[{mName:String,address:String}]
  
});


// the schema is useless so far
// we need to create a model using it
var Folder = mongoose.model('Folder', folderSchema);

// make this available to our users in our Node applications
module.exports = Folder;