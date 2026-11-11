import { useState } from 'react'

const Blog = ({ blog, onLike, onRemove }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  return (
    <div style={blogStyle}>
      <div>
        {blog.title}{' '}
        <button
          type="button"
          onClick={() => setDetailsVisible(!detailsVisible)}
        >
          {detailsVisible ? 'hide' : 'view'}
        </button>
      </div>
      {detailsVisible && (
        <div>
          <div>Author: {blog.author}</div>
          <div>
            URL: <a href={blog.url}>{blog.url}</a>
          </div>
          <div>
            Likes: {blog.likes}{' '}
            <button type="button" onClick={() => onLike(blog)}>
              like
            </button>
          </div>
          <div>Added by: {blog.user?.name || blog.user?.username}</div>
          {onRemove && (
            <button type="button" onClick={() => onRemove(blog)}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog