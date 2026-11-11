import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'

const LoginForm = (props) => {
  return (
    <form onSubmit={props.handleSubmit}>
      <TableContainer component={Paper}>
        <Table aria-label="Login form">
          <TableHead>
            <TableRow>
              <TableCell colSpan={2}>Login details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell><label htmlFor="login-username">username</label></TableCell>
              <TableCell>
                <input
                  id="login-username"
                  name="username"
                  autoComplete="username"
                  value={props.username}
                  onChange={props.handleUsernameChange}
                  style={{ boxSizing: 'border-box', width: '100%', padding: 10 }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell><label htmlFor="login-password">password</label></TableCell>
              <TableCell>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={props.password}
                  onChange={props.handlePasswordChange}
                  style={{ boxSizing: 'border-box', width: '100%', padding: 10 }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>
                <button type="submit" style={{ padding: '9px 18px', background: '#176b67', color: 'white', border: 0, borderRadius: 4 }}>
                  login
                </button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </form>
  )
}
export default LoginForm