//mongo
import mongoose from 'mongoose';
const UserScheme=new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    liked: [String], // array of search strings
    readLater:  [String], // array of search strings
});
//exporting scheme
const UserModel=mongoose.models.User ||mongoose.model('User',UserScheme)//next js especial
export default UserModel
