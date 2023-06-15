import { useContext, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/authContext.tsx'

let inputStyle = 'p-3 border-0 border-b-2 border-b-gray-300'

const Login = () => {
  const [inputs, setInputs] = useState({username: '', password: ''})
  const [error, setError] = useState(null)

  const navigate = useNavigate()
  const { user, login } = useContext(AuthContext)
  console.log(user)

  // useEffect(() => {
  //   if (user != null) {
  //     navigate('/')
  //   }
  // }, [])

  const handleChange = e => {
    setInputs(prev => ({...prev, [e.target.name]: e.target.value}))
  }
  
  const handleSubmit = async e => {
    e.preventDefault()

    try {
      setError(null)
      console.log(inputs)
      await login(inputs)
      // navigate('/')
    }
    catch (err: any) {
      setError(err.response.data)
    }
  }


  
  return (
    <div className='flex items-center justify-center h-screen bg-lightOrange flex-col'>
      <h1 className='text-5xl text-darkOrange mb-6'>Login</h1>
      <form className='flex flex-col p-12 bg-white gap-5 w-96'>
        <input type="text" placeholder='username' className={inputStyle} name='username' onChange={handleChange} />
        <input type="password" placeholder='password' className={inputStyle} name='password' onChange={handleChange} />
        <button className='p-3 bg-secondaryColor hover:text-white hover:bg-darkSecondary border border-black text-black cursor-pointer drop-shadow-[3px_4px_0px_rgba(0,0,0,1)] rounded-md relative hover:bottom-1' onClick={handleSubmit}>Login</button>
        {error && <p className='text-md text-red-700 text-center'>{error}</p>}
        <span className='text-md text-center text-secondaryBlack'>Don't have an account? <Link to='/register' className='text-darkSecondary underline'>Register</Link></span>
      </form>
    </div>
  )
}

export default Login