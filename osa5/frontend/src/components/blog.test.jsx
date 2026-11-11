import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders the blog title and author', async () => {
  const blog = {
    title: 'Komponenttien testaus',
    author: 'Joni Testi',
    url: 'https://testisivu.com',
    likes: 0,
    user: { name: 'Test User' }
  }
  render(<Blog blog={blog} />)
  const user = userEvent.setup()
  expect(screen.getByText(blog.title)).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'view' }))
  expect(screen.getByText(`Author: ${blog.author}`)).toBeInTheDocument()
})

test('clicking the like button twice calls the event handler twice', async () => {
  const blog = {
    title: 'Komponenttien testaus',
    author: 'Joni Testi',
    url: 'https://testisivu.com',
    likes: 0,
    user: { name: 'Test User' }
  }
  const onLike = vi.fn()
  const user = userEvent.setup()

  render(<Blog blog={blog} onLike={onLike} />)
  await user.click(screen.getByRole('button', { name: 'view' }))
  await user.click(screen.getByRole('button', { name: 'like' }))
  await user.click(screen.getByRole('button', { name: 'like' }))

  expect(onLike).toHaveBeenCalledTimes(2)
})