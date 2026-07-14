import { useState } from 'react'

const PRIVACY_OPTIONS = ['Public', 'Private', 'Collaborative']

function isDescriptionRequired(privacy) {
  return privacy === 'Public' || privacy === 'Collaborative'
}

function isFormValid({ name, privacy, description }) {
  if (name.trim().length < 3) {
    return false
  }

  if (isDescriptionRequired(privacy) && description.trim().length === 0) {
    return false
  }

  return true
}

function PlaylistForm({ onSubmit }) {
  const [name, setName] = useState('')
  const [privacy, setPrivacy] = useState('Private')
  const [description, setDescription] = useState('')
  const [isTouched, setIsTouched] = useState(false);

  const nameTooShort = name.length > 0 && name.trim().length < 3
  const descriptionRequired = isDescriptionRequired(privacy)
  const formValid = isFormValid({ name, privacy, description })
  const handleSubmit = (event) => {
    event.preventDefault()
    setIsTouched(true);
    if (!formValid) {
      return
    }

    onSubmit?.({ name: name.trim(), privacy, description: description.trim() })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="playlist-name">Playlist Name</label>
        <input
          id="playlist-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onBlur={() => setIsTouched(true)}
        />
        {(nameTooShort && isTouched) && (
          <p role="alert" style={{ color: 'red' }}>
            Playlist name must be at least 3 characters long.
          </p>
        )}
      </div>

      <div>
        <label htmlFor="playlist-privacy">Privacy</label>
        <select
          id="playlist-privacy"
          value={privacy}
          onChange={(event) => setPrivacy(event.target.value)}
        >
          {PRIVACY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="playlist-description">Description</label>
        <textarea
          id="playlist-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          aria-required={descriptionRequired}
        />
      </div>

      <button type="submit" disabled={!formValid} aria-disabled={!formValid}>
        Create Playlist
      </button>
    </form>
  )
}

export default PlaylistForm
