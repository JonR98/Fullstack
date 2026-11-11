const Blog = require('../models/blog.js')
const User = require('../models/user.js')

const initialBlogs = [
  {
    author: 'Joni Testi',
    title: 'Noden kanssa',
    url: 'https://testaa.com/',
    likes: 7,
  },
  {
    author: 'Jari Testi',
    title: 'testikirja',
    url: 'https://jaritestaa.com/',
    likes: 12,
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}