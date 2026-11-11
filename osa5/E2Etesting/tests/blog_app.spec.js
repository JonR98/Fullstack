const { test, describe, expect, beforeEach } = require('@playwright/test')


describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
    
  })
  //test('Login form is shown', async ({ page }) => {
  //  await page.goto('http://localhost:5173')

  //  const locator = page.getByText('Blogs')
  //  await expect(locator).toBeVisible()
  // await expect(page.getByText('Blogs')).toBeVisible()
  //})
  describe('Login', () => {
  test('succeeds with correct credentials', async ({ page }) => {

    await page.getByRole('link', { name: 'login' }).click()
    await page.getByLabel('username').fill('mluukkai')
    await page.getByLabel('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })
  test('login fails with wrong password', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    await page.getByLabel('username').fill('mluukkai')
    await page.getByLabel('password').fill('wrong')
    await page.getByRole('button', { name: 'login' }).click()
    const errorDiv = page.locator('.error')
    await expect(errorDiv).toContainText('Wrong username or password')
    await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
  })

  //test('logged-out users cannot like blogs', async ({ page, request }) => {
  //  const loginResponse = await request.post('http://localhost:3003/api/login', {
  //    data: { username: 'mluukkai', password: 'salainen' }
  //  })
  //  const { token } = await loginResponse.json()
  //  const title = 'E2E-unauthenticated-like'

  //  const blogResponse = await request.post('http://localhost:3003/api/blogs', {
  //    headers: { Authorization: `Bearer ${token}` },
  //    data: {
  //      title,
  //      author: 'Matti Luukkainen',
  //      url: 'http://unauthenticated-like-test.com',
  //      likes: 0
  //   }
  //  })
  //  expect(blogResponse.ok()).toBeTruthy()

  // await page.reload()
  //  await page.getByRole('link', { name: title }).click()
  //  await expect(page.getByRole('button', { name: 'like' })).toHaveCount(0)
  //})

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

  test('a new blog can be created', async ({ page }) => {
      await page.getByRole('link', { name: 'create new blog' }).click()
      await page.getByLabel('Title').fill('E2E-test')
      await page.getByLabel('Author').fill('Matti Luukkainen')
      await page.getByLabel('URL').fill('http://E2E-test.com')
      await page.getByRole('button', { name: 'save' }).click()
      await expect(page.getByRole('link', { name: 'E2E-test', exact: true })).toBeVisible()
      })
  
  test('a blog can be liked', async ({ page }) => {
    await page.getByRole('link', { name: 'create new blog' }).click()
    await page.getByLabel('Title').fill('E2E-like-test')
    await page.getByLabel('Author').fill('Matti Luukkainen')
    await page.getByLabel('URL').fill('http://E2E-like-test.com')
    await page.getByRole('button', { name: 'save' }).click()

    await page.getByRole('link', { name: 'E2E-like-test' }).click()
    await expect(page.getByText('Likes: 0')).toBeVisible()
    await page.getByRole('button', { name: 'like' }).click()
    await expect(page.getByText('Likes: 1')).toBeVisible()
  })

  test('user can delete blog', async ({ page }) => {
    await page.getByRole('link', { name: 'create new blog' }).click()
    await page.getByLabel('Title').fill('E2E-delete-test')
    await page.getByLabel('Author').fill('Matti Luukkainen')
    await page.getByLabel('URL').fill('http://E2E-delete-test.com')
    await page.getByRole('button', { name: 'save' }).click()

    const blogLink = page.getByRole('link', { name: 'E2E-delete-test', exact: true })
    await expect(blogLink).toBeVisible()
    await blogLink.click()
    await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

    page.once('dialog', dialog => dialog.accept())
    await page.getByRole('button', { name: 'remove' }).click()
    await expect(page.getByText('Blog not found')).toBeVisible()
  })

  test('only the blog creator can see the remove button', async ({ page, request }) => {
    await page.getByRole('link', { name: 'create new blog' }).click()
    await page.getByLabel('Title').fill('E2E-owned-blog')
    await page.getByLabel('Author').fill('Matti Luukkainen')
    await page.getByLabel('URL').fill('http://E2E-owned-blog.com')
    await page.getByRole('button', { name: 'save' }).click()

    const blogLink = page.getByRole('link', { name: 'E2E-owned-blog', exact: true })
    await expect(blogLink).toBeVisible()
    await blogLink.click()
    await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'remove',
        username: 'remove',
        password: 'salainen'
      }
    })
    await page.getByRole('button', { name: 'logout' }).click()
    await page.getByRole('link', { name: 'login' }).click()
    await page.getByLabel('username').fill('remove')
    await page.getByLabel('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('remove logged in')).toBeVisible()

    await page.getByRole('link', { name: 'blogs' }).click()
    await blogLink.click()
    await expect(page.getByRole('button', { name: 'remove' })).toHaveCount(0)
  })

//  test('blogs are sorted by likes, most liked first', async ({ page }) => {
//    const blogsWithLikes = [
//     { title: 'liketest1', likes: 1 },
//     { title: 'liketest3', likes: 3 },
//      { title: 'liketest2', likes: 2 }
//    ]
//
//    for (const blogData of blogsWithLikes) {
//      await page.getByRole('link', { name: 'create new blog' }).click()
//      await page.getByLabel('Title').fill(blogData.title)
//      await page.getByLabel('Author').fill('Matti Luukkainen')
//      await page.getByLabel('URL').fill(`http://${blogData.title}.com`)
//      await page.getByRole('button', { name: 'save' }).click()
//
//      const blog = page.locator('ul > div').filter({ hasText: blogData.title })
//      await expect(blog).toBeVisible()
//      await blog.getByRole('link', { name: blogData.title }).click()
//
//       for (let like = 0; like < blogData.likes; like += 1) {
//        await blog.getByRole('button', { name: 'like' }).click()
//        await expect(blog).toContainText(`Likes: ${like + 1}`)
//      }
//      await page.getByRole('link', { name: 'blogs' }).click()
//    }
//
//    const renderedBlogs = page.locator('ul > div')
//    await expect(renderedBlogs.nth(0)).toContainText('liketest3')
//    await expect(renderedBlogs.nth(1)).toContainText('liketest2')
//    await expect(renderedBlogs.nth(2)).toContainText('liketest1')
//  })
  })
})
})