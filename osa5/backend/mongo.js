const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${encodeURIComponent(password)}@cluster0.5d3ww8r.mongodb.net/blog?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const blogSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Blog = mongoose.model('Blog', blogSchema)


Blog.find({}).then((result) => {
  result.forEach((blog) => {
    console.log(blog)
  })
  mongoose.connection.close()
})