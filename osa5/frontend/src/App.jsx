import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { Link, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import Blog, { BlogDetails } from './components/blog'
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

const BlogDetailPage = ({ blogs, user, onLike, onRemove }) => {
  const { id: blogId } = useParams()
  const blog = blogs.find(currentBlog => currentBlog.id === blogId)

  return (
    <main>
      {blog ? (
        <BlogDetails
          blog={blog}
          onLike={user ? onLike : null}
          onRemove={user?.username === blog.user?.username ? onRemove : null}
        />
      ) : (
        <p>Blog not found</p>
      )}
    </main>
  )
}

const App = () => {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([])
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
      setNotification({
        message: `${createdBlog.title} added to the blog list`,
        type: 'success',
      })
      navigate('/')
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

  const sortedBlogs = [...blogs].sort(
    (firstBlog, secondBlog) => Number(secondBlog.likes || 0) - Number(firstBlog.likes || 0)
  )

  return (
    <div>
      <nav style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: '#176b67' }}>
        <Link style={{ color: 'white' }} to="/">blogs</Link>
        {user && <Link style={{ color: 'white' }} to="/blogs/new">create new blog</Link>}
        {user ? (
          <button type="button" onClick={handleLogout} style={{ marginLeft: 'auto' }}>logout</button>
        ) : (
          <Link style={{ color: 'white', marginLeft: 'auto' }} to="/login">login</Link>
        )}
      </nav>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>
        <NotificationMessage {...notification} />
        <Routes>
          <Route path="/" element={(
            <main>
              {user && (
                <div className="login-status">
                  <span>{user.name || user.username} logged in</span>
                </div>
              )}
              <h2>Blogs</h2>
              <TableContainer component={Paper}>
                <Table aria-label="Blogs">
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Author</TableCell>
                      <TableCell align="right">Likes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedBlogs.map(blog => (
                      <Blog key={blog.id} blog={blog} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </main>
          )} />
          <Route path="/blogs/:id" element={(
            <BlogDetailPage
              blogs={blogs}
              user={user}
              onLike={likeBlog}
              onRemove={removeBlog}
            />
          )} />
          <Route path="/blogs/new" element={(
            user ? (
              <main>
                <h2>Create a blog</h2>
                <BlogForm
                  title={newTitle}
                  author={newAuthor}
                  url={newUrl}
                  handleTitleChange={({ target }) => setNewTitle(target.value)}
                  handleAuthorChange={({ target }) => setNewAuthor(target.value)}
                  handleUrlChange={({ target }) => setNewUrl(target.value)}
                  handleSubmit={addBlog}
                />
              </main>
            ) : (
              <Navigate to="/login" replace />
            )
          )} />
          <Route path="/login" element={(
            <main className="login-section">
              <h1>Blogs</h1>
              {user ? (
                <div className="login-status">
                  <span>{user.name || user.username} logged in</span>
                </div>
              ) : (
                <LoginForm
                  username={username}
                  password={password}
                  handleUsernameChange={({ target }) => setUsername(target.value)}
                  handlePasswordChange={({ target }) => setPassword(target.value)}
                  handleSubmit={handleLogin}
                />
              )}
            </main>
          )} />
          <Route path="/blogs" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default App