import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/authContext.tsx'
// import axios from 'axios'

let inputStyle = 'p-3 border-0 border-b-2 border-b-gray-300'

const Register = () => {
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  const { register } = useContext(AuthContext)

  const handleChange = e => {
    setInputs(prev => ({...prev, [e.target.name]: e.target.value}))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      setError(null)
      await register(inputs)
      navigate('/')
    }
    catch (err: any) {
      setError(err.response.data)
    }

  }


  return (
    <div className='flex items-center justify-center h-screen bg-lightOrange flex-col max-w-[1300px]'>
      <h1 className='text-5xl text-black mb-6'>Register</h1>
      <form className='flex flex-col p-12 bg-white gap-5 w-96'>
        <input type="email" placeholder='email' className={inputStyle} name='email' required onChange={handleChange} />
        <input type="password" placeholder='password' className={inputStyle} name='password' required onChange={handleChange} />
        <button className='p-3 bg-secondaryColor hover:text-white hover:bg-darkSecondary border border-black text-black cursor-pointer drop-shadow-[3px_4px_0px_rgba(0,0,0,1)] rounded-md relative hover:bottom-1' onClick={handleSubmit}>Register</button>
        {error && <p className='text-md text-red-700 text-center'>{error}</p>}
        <span className='text-md text-center text-secondaryBlack'>Do you have an account? <Link className='text-darkSecondary underline' to='/login'>Login</Link></span>
      </form>
    </div>
  )
}

export default Register