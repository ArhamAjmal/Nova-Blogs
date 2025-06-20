//mongo
//2)making a scheme for todo list
import mongoose from 'mongoose';
const blogscheme=new mongoose.Schema({
    title :String,
    category: String,
    description:String,
    tags:[String],
    slug:String,
    coverImageUrl:String,
    date: { type: Date, default: Date.now },
    shares:Number,
    likes:Number,
    author:String,
    views:Number,
},{
  timestamps: true // ✅ Automatically adds createdAt and updatedAt
});
//exporting scheme
const BlogModel=mongoose.models.MyBlogs ||mongoose.model('MyBlogs',blogscheme)//next js especial
export default BlogModel
