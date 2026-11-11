import { render, screen } from '@testing-library/react'
import { useState } from 'react'
import BlogForm from './blogform'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

const BlogFormHarness = ({ onSubmit }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  return (
    <BlogForm
      title={title}
      author={author}
      url={url}
      handleTitleChange={({ target }) => setTitle(target.value)}
      handleAuthorChange={({ target }) => setAuthor(target.value)}
      handleUrlChange={({ target }) => setUrl(target.value)}
      handleSubmit={onSubmit}
    />
  )
}

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const onSubmit = vi.fn(event => event.preventDefault())

  render(<BlogFormHarness onSubmit={onSubmit} />)

  const titleInput = screen.getByRole('textbox', { name: 'Title' })
  const authorInput = screen.getByRole('textbox', { name: 'Author' })
  const urlInput = screen.getByRole('textbox', { name: 'URL' })

  await user.type(titleInput, 'lomaketesti')
  await user.type(authorInput, 'Joni testi')
  await user.type(urlInput, 'https://testisivu.com')

  expect(titleInput).toHaveValue('lomaketesti')
  expect(authorInput).toHaveValue('Joni testi')
  expect(urlInput).toHaveValue('https://testisivu.com')

  await user.click(screen.getByRole('button', { name: 'save' }))

  expect(onSubmit).toHaveBeenCalledOnce()
})