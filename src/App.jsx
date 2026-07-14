import PlaylistForm from './components/PlaylistForm'

function App() {
  function handleCreatePlaylist(playlist) {
    console.log(playlist)
  }
  return <PlaylistForm onSubmit={handleCreatePlaylist} />
}

export default App
