const Blog = require('../models/blog')
const main = async () => {
  const blogs = await Blog.find({})
  console.log('operation returned the following blogs', blogs)

  const response = await blogs[0].deleteOne()
  console.log('the first blog is removed')
}
main()