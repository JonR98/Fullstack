const BlogForm = (props) => {
  return (
    <form onSubmit={props.handleSubmit}>
      <div>
        <label>
          Title
          <input
            required
            value={props.title}
            onChange={props.handleTitleChange}
          />
        </label>
      </div>
      <div>
        <label>
          Author
          <input
            required
            value={props.author}
            onChange={props.handleAuthorChange}
          />
        </label>
      </div>
      <div>
        <label>
          URL
          <input
            type="url"
            required
            value={props.url}
            onChange={props.handleUrlChange}
          />
        </label>
      </div>
      <button type="submit">save</button>
    </form>
  )
}
export default BlogForm