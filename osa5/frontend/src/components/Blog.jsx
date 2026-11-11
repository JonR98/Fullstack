import { Link } from 'react-router-dom'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'

const Blog = ({ blog }) => (
  <TableRow>
    <TableCell>
      <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
    </TableCell>
    <TableCell>{blog.author || 'Unknown author'}</TableCell>
    <TableCell align="right">{blog.likes || 0}</TableCell>
  </TableRow>
)

export const BlogDetails = ({ blog, onLike, onRemove }) => (
  <div>
    <h2>{blog.title}</h2>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Author: {blog.author}</TableCell>
            <TableCell />
          </TableRow>
          <TableRow>
            <TableCell>
              URL: <a href={blog.url}>{blog.url}</a>
            </TableCell>
            <TableCell />
          </TableRow>
          <TableRow>
            <TableCell>Likes: {blog.likes}</TableCell>
            <TableCell>
              {onLike && (
                <button type="button" onClick={() => onLike(blog)}>
                  like
                </button>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Added by: {blog.user?.name || blog.user?.username}</TableCell>
            <TableCell>
              {onRemove && (
                <button type="button" onClick={() => onRemove(blog)}>
                  remove
                </button>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </div>
)

export default Blog