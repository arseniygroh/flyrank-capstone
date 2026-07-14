import { useState } from 'react'

function PlaylistForm({ onSubmit }) {
  const [name, setName] = useState('')
  const [privacy, setPrivacy] = useState('public')
  const [description, setDescription] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    onSubmit?.({
      name: name.trim(),
      privacy,
      description: description.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="playlist-name">Playlist name</label>
        <input
          id="playlist-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter playlist name"
          required
        />
      </div>

      <div>
        <label htmlFor="playlist-privacy">Privacy</label>
        <select
          id="playlist-privacy"
          value={privacy}
          onChange={(event) => setPrivacy(event.target.value)}
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>

      <div>
        <label htmlFor="playlist-description">Description</label>
        <textarea
          id="playlist-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe your playlist"
          rows={4}
        />
      </div>

      <button type="submit">Create playlist</button>
    </form>
  )
}

export default PlaylistForm
