import Navbar from "./components/Navbar";
import NotesDisplay from "./components/NotesDisplay";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <NotesDisplay />
    </div>
  );
}

export default App;
