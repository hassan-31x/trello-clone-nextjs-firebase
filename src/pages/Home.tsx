import React from 'react';

import Navbar from '../components/Navbar';
import NotesDisplay from '../components/NotesDisplay';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col w-screen max-w-full">
      <Navbar />
      <NotesDisplay />
    </div>
  );
};

export default Home;
