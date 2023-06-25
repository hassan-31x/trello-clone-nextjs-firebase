import { useState, useEffect, useContext, useRef, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext.tsx';

let inputStyle = 'p-3 border-0 border-b-2 border-b-gray-300';

interface FormProps {
  buttonText: 'register' | 'login';
}

const Form: React.FC<FormProps> = ({ buttonText }) => {
    const [inputs, setInputs] = useState<{ email: string; password: string }>({email: '', password: '',});
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const buttonRef = useRef<HTMLButtonElement>(null);

    const { user, login, register } = useContext(AuthContext);

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
        
        // disabling button so the user can not send multiple requests till the response arrives
        if (buttonRef.current) {
          buttonRef.current.disabled = true;
        }
    
        const res = buttonText === 'register' ? await register(inputs) : await login(inputs);
        
        if (res === 'Success') {
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
      <h1 className='text-5xl text-black mb-6 capitalize'>{buttonText}</h1>
      <form className='flex flex-col p-12 bg-white gap-5 w-96 rounded-lg max-w-[90vw]' onSubmit={handleSubmit}>
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
          className='p-3 bg-blue-500 hover:text-white hover:bg-darkSecondary border border-black text-black cursor-pointer drop-shadow-[3px_4px_0px_rgba(0,0,0,1)] rounded-md relative hover:bottom-1 capitalize'
          type='submit'
        >
          {buttonText}
        </button>
        {error && <p className='text-md text-red-700 text-center'>{error}</p>}
        {buttonText === 'register' ?
        <span className='text-md text-center text-secondaryBlack'>
          Already have an account? <Link className='text-darkSecondary underline' to='/login'>Login</Link>
        </span> :
        <span className='text-md text-center text-secondaryBlack'>
          Don't have an account? <Link to='/register' className='text-darkSecondary underline'>Register</Link>
        </span>}
      </form>
    </div>
  );
};

export default Form;
