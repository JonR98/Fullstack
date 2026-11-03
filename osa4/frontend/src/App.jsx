import { useEffect, useState } from 'react'
import axios from 'axios'
import './index.css'
import Notification from './components/Notification'
const baseUrl = '/api/blogs'
const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newLikes, setNewLikes] = useState('0')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    if (!notification) {
      return
    }

    const timeoutId = setTimeout(() => setNotification(null), 5000)
    return () => clearTimeout(timeoutId)
  }, [notification])

  const filteredBlogs = blogs.filter(blog =>
    blog.author.toLowerCase().includes(filter.toLowerCase())
  )

  const addBlog = (event) => {
    event.preventDefault()
    const name = newBlog.trim()
    const title = newTitle.trim()
    const url = newUrl.trim()
    const likes = Number(newLikes)

    if (name.length < 3) {
      setNotification({
        message: 'Name must be at least 3 characters long',
        type: 'error'
      })
      return
    }
    const blog = { author: name, title, url, likes }
    axios
      .post(baseUrl, blog)
      .then(response => {
        setBlogs(currentBlogs => currentBlogs.concat(response.data))
        setNotification({
          message: `${response.data.title} added to the blog list`,
          type: 'success'
        })
        setNewBlog('')
        setNewTitle('')
        setNewUrl('')
        setNewLikes('0')
      })
      .catch(() => {
        alert('The new blog could not be saved to the server.')
      })
  }

  const likeBlog = (blog) => {
    const updatedBlog = { ...blog, likes: (blog.likes ?? 0) + 1 }

    axios
      .put(`${baseUrl}/${blog.id}`, updatedBlog)
      .then(response => {
        setBlogs(currentBlogs =>
          currentBlogs.map(currentBlog =>
            currentBlog.id === blog.id ? response.data : currentBlog
          )
        )
      })
      .catch(() => {
        setNotification({
          message: `Could not update likes for ${blog.title}.`,
          type: 'error'
        })
      })
  }

  const deleteBlog = (blog) => {
    if (!window.confirm(`Delete ${blog.author}?`)) {
      return
    }

    axios
      .delete(`${baseUrl}/${blog.id}`)
      .then(() => {
        setBlogs(currentBlogs =>
          currentBlogs.filter(currentBlog => currentBlog.id !== blog.id)
        )
        setNotification({
          message: `${blog.author} deleted from the server.`,
          type: 'success'
        })
      })
      .catch(() => {
        alert(`Could not delete ${blog.author} from the server.`)
      })
  }

  const hook = () => {
  console.log('effect')
  axios
    .get(baseUrl)
    .then(response => {
      console.log('promise fulfilled')
      setBlogs(response.data)
    })
}

useEffect(hook, [])
  console.log('render', blogs.length, 'blogs')
  return (
    <div>
      <h2>Blog</h2>
      <Notification
        message={notification?.message}
        type={notification?.type}
      />
      <form onSubmit={addBlog}>
        <div>
          filter shown with:{' '}
          <input
            value={filter}
            onChange={event => setFilter(event.target.value)}
          />
        </div>
        <div>
          <h2>Add a new blog</h2>
      Author: <input
            required
            value={newBlog}
            onChange={(event) => setNewBlog(event.target.value)}
          />
        </div>
        <div>Title: <input
          required
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
        /></div>
        <div>URL: <input
          type="url"
          required
          value={newUrl}
          onChange={(event) => setNewUrl(event.target.value)}
        /></div>
        
        
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Blogs</h2>
      <ul>
        {filteredBlogs.map(blog => (
          <li key={blog.id}>
            <strong>{blog.author}</strong>: {blog.title} | {blog.likes ?? 0} likes{' '}
            <button type="button" onClick={() => likeBlog(blog)}>like</button>{' '}
            <button type="button" onClick={() => deleteBlog(blog)}>delete</button>{' '}
            <a href={blog.url} target="_blank" rel="noreferrer">{blog.url}</a>{' '}
            
            
            
          </li>
        ))}
      </ul>
    </div>
  )

}

export default App