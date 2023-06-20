import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

import { IconContext } from "react-icons";
import { AiOutlinePlus, AiOutlineSearch, AiOutlineBell } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import Logo from "../assets/logo.png";

const Navbar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-black text-white flex h-14 items-center px-4 justify-between">
      <div className="left flex h-full items-center gap-10">
        <div className="logo flex h-full items-center gap-2 font-bold text-lg">
          <img className="w-5" src={Logo} alt="" />
          Trello
        </div>
        <div className="nav-items gap-4 w-full items-center hidden md:flex">
          <p className="flex gap-1 h-full items-center text-sm">
            Workspace <IoIosArrowDown />
          </p>
          <p className="flex gap-1 h-full items-center text-sm">
            Recent <IoIosArrowDown />
          </p>
          <p className="flex gap-1 h-full items-center text-sm">
            More <IoIosArrowDown />
          </p>
          <IconContext.Provider
            value={{
              className: "text-3xl bg-gray-700 text-white py-1 rounded-md ml-2",
            }}
          >
            <AiOutlinePlus />
          </IconContext.Provider>

        </div>
      </div>

      <div className="right flex h-full items-center gap-3">
        <p className='hidden lg:block'>{user?.email}</p>
        <IconContext.Provider value={{ className: "text-xl font-bold" }}>
          <AiOutlineSearch />
        </IconContext.Provider>
        <IconContext.Provider value={{ className: "text-xl font-bold" }}>
          <AiOutlineBell />
        </IconContext.Provider>
        <div className="text-[0.6rem] bg-green-600 rounded-full w-6 h-6 flex justify-center items-center">
          {user?.email.slice(0, 2).toUpperCase() || 'MK'}
        </div>
        <button onClick={user ? logout : () => navigate('/login')} className='hidden md:block'>
          {user ? 'Log Out' : 'Login to save progress'}
        </button>
        <button onClick={user ? logout : () => navigate('/login')} className='block md:hidden'>
          {user ? 'Log Out' : 'Login'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
