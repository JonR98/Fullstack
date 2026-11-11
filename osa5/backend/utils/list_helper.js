const dummy = (blogs) => {
  return blogs.length >= 0 ? 1 : 0
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((mostLiked, blog) =>
    blog.likes > mostLiked.likes ? blog : mostLiked
  )
}

module.exports = {
  dummy,
  totalLikes,
  mostLikes
}
