import { useContext, useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext.tsx';

const inputStyle = 'p-3 border-0 border-b-2 border-b-gray-300 invalid:border-red-500';

const Login = (): JSX.Element => {
  const [inputs, setInputs] = useState<{ email: string; password: string }>({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext);

  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
  
    if (buttonRef.current) {
      buttonRef.current.disabled = true;
    }
  
    const res = await login(inputs);
  
    if (res === 'Done') {
      setError(null);
      navigate('/');
    } else {
      const regex = /\(auth\/([^)]+)\)/;
      const match = res.match(regex);
      const extractedText = match ? match[1] : null;
      setError(extractedText);
    }
  
    if (buttonRef.current) {
      buttonRef.current.disabled = false;
    }
  };

  return (
    <div className='flex items-center justify-center h-screen bg-blue-300 flex-col'>
      <h1 className='text-5xl text mb-6'>Login</h1>
      <form className='flex flex-col p-12 bg-white gap-5 w-96 rounded-lg max-w-[90vw]' onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='email'
          className={inputStyle}
          name='email'
          value={inputs.email}
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='password'
          className={inputStyle}
          name='password'
          value={inputs.password}
          onChange={handleChange}
        />
        <button
          ref={buttonRef}
          className='p-3 bg-blue-500 hover:text-white hover:bg-darkSecondary border border-black text-black cursor-pointer drop-shadow-[3px_4px_0px_rgba(0,0,0,1)] rounded-md relative hover:bottom-1'
          type='submit'
        >
          Login
        </button>
        {error && <p className='text-md text-red-700 text-center'>{error}</p>}
        <span className='text-md text-center text-secondaryBlack'>
          Don't have an account? <Link to='/register' className='text-darkSecondary underline'>Register</Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
