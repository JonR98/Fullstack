import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
const BlogForm = (props) => {
  return (
    <form onSubmit={props.handleSubmit}>
      <TableContainer component={Paper}>
        <Table aria-label="Create blog form">
          <TableHead>
            <TableRow>
              <TableCell colSpan={2}>Blog information</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell><label htmlFor="blog-title">Title</label></TableCell>
              <TableCell>
                <input
                  id="blog-title"
                  required
                  value={props.title}
                  onChange={props.handleTitleChange}
                  style={{ boxSizing: 'border-box', width: '100%', padding: 10 }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell><label htmlFor="blog-author">Author</label></TableCell>
              <TableCell>
                <input
                  id="blog-author"
                  required
                  value={props.author}
                  onChange={props.handleAuthorChange}
                  style={{ boxSizing: 'border-box', width: '100%', padding: 10 }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell><label htmlFor="blog-url">URL</label></TableCell>
              <TableCell>
                <input
                  id="blog-url"
                  type="url"
                  required
                  value={props.url}
                  onChange={props.handleUrlChange}
                  style={{ boxSizing: 'border-box', width: '100%', padding: 10 }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>
                <button type="submit" style={{ padding: '9px 18px', background: '#176b67', color: 'white', border: 0, borderRadius: 4 }}>
                  save
                </button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </form>
  )
}
export default BlogForm