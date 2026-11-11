import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/blogform'
import LoginForm from './components/loginform'
import blogService from './services/blogs'
import loginService from './services/login'

const NotificationMessage = ({ message, type }) => {
  if (!message) {
    return null
  }

  return <div className={`notification ${type}`}>{message}</div>
}

const App = () => {
  const [loginVisible, setLoginVisible] = useState(false)
  const [blogs, setBlogs] = useState([])
  const [blogFormVisible, setBlogFormVisible] = useState(false)
  const [notification, setNotification] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(() => {
    const savedUser = window.localStorage.getItem('loggedBlogappUser')
    return savedUser ? JSON.parse(savedUser) : null
  })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])
  useEffect(() => {
    if (user) {
      blogService.setToken(user.token)
    }
  }, [user])

  useEffect(() => {
    if (!notification) {
      return
    }

    const timeoutId = window.setTimeout(() => setNotification(null), 5000)
    return () => window.clearTimeout(timeoutId)
  }, [notification])

  const handleLogin = async (event) => {
    event.preventDefault()
    setNotification(null)

    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setNotification({ message: 'Wrong username or password', type: 'error' })
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const addBlog = async (event) => {
    event.preventDefault()
    setNotification(null)

    try {
      const createdBlog = await blogService.create({
        title: newTitle,
        author: newAuthor,
        url: newUrl,
        likes: 0,
      })
      setBlogs(currentBlogs => currentBlogs.concat(createdBlog))
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
      setBlogFormVisible(false)
      setNotification({
        message: `${createdBlog.title} added to the blog list`,
        type: 'success',
      })
    } catch {
      setNotification({ message: 'Could not create the blog', type: 'error' })
    }
  }

  const likeBlog = async (blog) => {
    try {
      const updatedBlog = await blogService.update(blog.id, {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: Number(blog.likes || 0) + 1,
      })
      setBlogs(currentBlogs => currentBlogs.map(currentBlog =>
        currentBlog.id === blog.id
          ? { ...updatedBlog, user: blog.user }
          : currentBlog
      ))
    } catch {
      setNotification({ message: 'Could not like the blog', type: 'error' })
    }
  }

  const removeBlog = async (blog) => {
    if (!window.confirm(`Remove ${blog.title}?`)) {
      return
    }

    try {
      await blogService.remove(blog.id)
      setBlogs(currentBlogs => currentBlogs.filter(currentBlog =>
        currentBlog.id !== blog.id
      ))
      setNotification({ message: `${blog.title} removed`, type: 'success' })
    } catch {
      setNotification({ message: 'Could not remove the blog', type: 'error' })
    }
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <div>
            <button type="button" onClick={() => setLoginVisible(false)}>
              cancel
            </button>
          </div>
        </div>
      </div>
    )
  }
  if (!user) {
    return (
      <main className="login-section">
        <h1>Blogs</h1>
        <h2>Log in</h2>
        <NotificationMessage {...notification} />
        {loginForm()}
      </main>
    )
  }

  return (
    <main>

      <NotificationMessage {...notification} />
      <div className="login-status">
        <span>{user.name || user.username} logged in</span>
        <button type="button" onClick={handleLogout}>logout</button>
      </div>
      {blogFormVisible ? (
        <div>
          <BlogForm
            title={newTitle}
            author={newAuthor}
            url={newUrl}
            handleTitleChange={({ target }) => setNewTitle(target.value)}
            handleAuthorChange={({ target }) => setNewAuthor(target.value)}
            handleUrlChange={({ target }) => setNewUrl(target.value)}
            handleSubmit={addBlog}
          />
          <button type="button" onClick={() => setBlogFormVisible(false)}>
            cancel
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => setBlogFormVisible(true)}>
          create new blog
        </button>
      )}
      <h2>Blogs</h2>
      <ul>
        {blogs.map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            onLike={likeBlog}
            onRemove={blog.user?.username === user.username ? removeBlog : null}
          />
        ))}
      </ul>
    </main>
  )
}

export default App