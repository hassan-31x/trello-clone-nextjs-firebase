import NotesDisplay from '../components/NotesDisplays'
import Navbar from '../components/Navbar'

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <NotesDisplay />
    </div>
  )
}

export default Home