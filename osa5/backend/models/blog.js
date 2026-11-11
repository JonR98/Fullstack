const mongoose = require('mongoose')
const blogSchema = mongoose.Schema({
  title: { type: String, required: true },
  id: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  author: String,
  url: String,
  likes: { type: Number, default: 0 },


  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject._id = returnedObject._id.toString()
    delete returnedObject.__v
    delete returnedObject._id
    delete returnedObject.passwordHash
  },
})

module.exports = mongoose.model('Blog', blogSchema)