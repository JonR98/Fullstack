import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Blog, { BlogDetails } from './blog'

test('links the blog title to its detail page', () => {
  const blog = {
    id: 'blog-1',
    title: 'Komponenttien testaus',
    author: 'Joni Testi',
    url: 'https://testisivu.com',
    likes: 0,
    user: { name: 'Test User' }
  }
  render(<MemoryRouter><Blog blog={blog} /></MemoryRouter>)
  expect(screen.getByRole('link', { name: blog.title })).toHaveAttribute('href', '/blogs/blog-1')
})

test('shows blog details and calls the like handler', async () => {
  const blog = {
    id: 'blog-1',
    title: 'Komponenttien testaus',
    author: 'Joni Testi',
    url: 'https://testisivu.com',
    likes: 0,
    user: { name: 'Test User' }
  }
  const onLike = vi.fn()
  const user = userEvent.setup()

  render(<BlogDetails blog={blog} onLike={onLike} />)
  expect(screen.getByText(`Author: ${blog.author}`)).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'like' }))
  await user.click(screen.getByRole('button', { name: 'like' }))

  expect(onLike).toHaveBeenCalledTimes(2)
})

test('does not show the like button without a logged-in user handler', () => {
  const blog = {
    id: 'blog-1',
    title: 'Komponenttien testaus',
    author: 'Joni Testi',
    url: 'https://testisivu.com',
    likes: 0,
    user: { name: 'Test User' }
  }

  render(<BlogDetails blog={blog} />)
  expect(screen.queryByRole('button', { name: 'like' })).not.toBeInTheDocument()
})

test('shows the remove button for a blog with a creator delete handler', async () => {
  const blog = {
    id: 'blog-1',
    title: 'Komponenttien testaus',
    author: 'Joni Testi',
    url: 'https://testisivu.com',
    likes: 0,
    user: { username: 'creator' }
  }
  const onRemove = vi.fn()
  const user = userEvent.setup()

  render(<BlogDetails blog={blog} onRemove={onRemove} />)

  const removeButton = screen.getByRole('button', { name: 'remove' })
  expect(removeButton).toBeVisible()
  await user.click(removeButton)
  expect(onRemove).toHaveBeenCalledWith(blog)
})