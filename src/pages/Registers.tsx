import { useState, useContext, useRef, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext.tsx';

let inputStyle = 'p-3 border-0 border-b-2 border-b-gray-300';

const Register = (): JSX.Element => {
  const [inputs, setInputs] = useState<{ email: string; password: string }>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { user, register } = useContext(AuthContext);


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
    buttonRef.current!.disabled = true;

    const res = await register(inputs);
    if (res === 'Success') {
      setError(null);
      navigate('/');
    } else {
      const regex = /\(auth\/([^)]+)\)/;
      const match = res.match(regex);
      const extractedText = match ? match[1] : null;

      setError(extractedText);
    }

    buttonRef.current!.disabled = false;
  };

  return (
    <div className='flex items-center justify-center h-screen bg-blue-300 flex-col'>
      <h1 className='text-5xl text-black mb-6'>Register</h1>
      <form className='flex flex-col p-12 bg-white gap-5 w-96 rounded-lg' onSubmit={handleSubmit}>
        <input
          type='email'
          placeholder='email'
          className={inputStyle}
          name='email'
          required
          onChange={handleChange}
          value={inputs.email}
        />
        <input
          type='password'
          placeholder='password'
          className={inputStyle}
          name='password'
          required
          onChange={handleChange}
          value={inputs.password}
        />
        <button
          ref={buttonRef}
          className='p-3 bg-blue-500 hover:text-white hover:bg-darkSecondary border border-black text-black cursor-pointer drop-shadow-[3px_4px_0px_rgba(0,0,0,1)] rounded-md relative hover:bottom-1'
          type='submit'
        >
          Register
        </button>
        {error && <p className='text-md text-red-700 text-center'>{error}</p>}
        <span className='text-md text-center text-secondaryBlack'>
          Do you have an account? <Link className='text-darkSecondary underline' to='/login'>Login</Link>
        </span>
      </form>
    </div>
  );
};

export default Register;