import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import PlaylistForm from './PlaylistForm'

describe('PlaylistForm', () => {
  it('keeps the submit button disabled when Public is selected but the description is empty', async () => {
    const user = userEvent.setup()

    render(<PlaylistForm />)

    await user.type(screen.getByLabelText(/playlist name/i), 'My Playlist')
    await user.selectOptions(screen.getByLabelText(/privacy/i), 'Public')

    const submitButton = screen.getByRole('button', { name: /create playlist/i })

    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveAttribute('aria-disabled', 'true')
  })
})
