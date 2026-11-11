const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert/strict')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const supertest = require('supertest')
const app = require('../app')
const blog = require('../models/blog')
const User = require('../models/user')

const helper = require('./test_helper')

const api = supertest(app)


beforeEach(async () => {
  await blog.deleteMany({})

  if (!await User.exists({})) {
    await new User({ username: 'blog-test-user', passwordHash: 'test-hash' }).save()
  }

  let blogObject = new blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new blog(helper.initialBlogs[1])
  await blogObject.save()
})
test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

})
test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})
test('the blog with the most likes is returned', async () => {
  const response = await api.get('/api/blogs/most-liked')

  assert.strictEqual(response.status, 200)
  assert.strictEqual(response.body.title, helper.initialBlogs[1].title)
})
test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')
  console.log('Blogs returned from database:', response.body)
  const titles = response.body.map(e => e.title)
  assert(titles.includes('Noden kanssa'))
})
test('returned blogs must have  identifier id', async () => {
  const response = await api.get('/api/blogs')
  const ids = response.body.map(blog => blog.id)
  assert(ids.every(id => id !== undefined))
})
test('a valid blog can be added ', async () => {
  const firstUser = await User.findOne().sort({ _id: 1 })
  const token = jwt.sign(
    { username: firstUser.username, id: firstUser._id.toString() },
    process.env.SECRET
  )
  const newBlog = {
    author: 'Jari Testi',
    title: 'testikirja',
    url: 'https://testaa.com/',
    likes: 7,
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.user.username, firstUser.username)
  assert.ok(response.body.id)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  const titles = blogsAtEnd.map(b => b.title)
  assert(titles.includes(newBlog.title))
})
test('blog without title is not added', async () => {
  const firstUser = await User.findOne().sort({ _id: 1 })
  const token = jwt.sign(
    { username: firstUser.username, id: firstUser._id.toString() },
    process.env.SECRET
  )
  const newBlog = {
    author: 'Jari Testi',
    url: 'https://testaa.com/',
    likes: 0,
  }


  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('a blog cannot be updated without authentication', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({ likes: blogToUpdate.likes + 1 })
    .expect(401)
})

test('an authenticated user can update a blog', async () => {
  const firstUser = await User.findOne().sort({ _id: 1 })
  const token = jwt.sign(
    { username: firstUser.username, id: firstUser._id.toString() },
    process.env.SECRET
  )
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ likes: blogToUpdate.likes + 1 })
    .expect(200)

  assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
})

test('a specific blog can be viewed', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToView = blogsAtStart[0]


  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultBlog.body, blogToView)
})
test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const ids = blogsAtEnd.map((blog) => blog.id)
  assert(!ids.includes(blogToDelete.id))

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})
after(async () => {
  await mongoose.connection.close()
})