const mongoose= require('mongoose')

const connectDB=()=>{
   return mongoose.connect("mongodb+srv://fionaalter23:xqUkjT6GqLxKagcL@namastenodejs.eortr.mongodb.net/codeConnect")
}

module.exports={connectDB};