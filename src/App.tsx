import Navbar from "./components/Navbar";
import NotesDisplay from "./components/NotesDisplay";
import QuoteApp from "./components/Test";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <NotesDisplay />
      <Navbar />
      <QuoteApp />
    </div>
  );
}

export default App;
