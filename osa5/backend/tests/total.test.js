const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '7',
      title: 'My New Blog Post',
      author: 'Jari',
      url: 'https://example.com/my-new-blog-post',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('mostLikes returns the blog with the highest likes', () => {
    const blogs = [
      ...listWithOneBlog,
      { title: 'testi', author: 'Joni', url: 'https://fullstack-ldwt.onrender.com/', likes: 4 },
      { title: 'testikirja', author: 'Jari', url: 'https://fullstack-ldwt.onrender.com', likes: 3 },
    ]

    assert.strictEqual(listHelper.mostLikes(blogs), blogs[0])
  })


})