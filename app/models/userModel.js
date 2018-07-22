var mongoose = require ('mongoose');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

var userApi = new Schema({
    fullName: {type: String, trim: true, required: true},
    email: {type: String, unique: true, lowercase: true, trim: true, required: true},
    hash_password: {type:String, required: true},
    created: {type: Date, default: Date.now}
});

userApi.method.comparePassword = function(password){
    return bcrypt.compareSync(password, this.hash_password);
};


mongoose.model('UserAPI', userApi);

