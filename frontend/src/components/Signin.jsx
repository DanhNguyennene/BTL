import React, {useState, useRef, useEffect} from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext'


const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;


const Signin = () => {
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const {login} = useAuth();

  const[username, setUsername] = useState('');
  const [validUsername, setValidUsername] = useState(false);
  const[usernameFocus, setUsernameFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);


  const [errMsg, setErrMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [username, pwd]);


  useEffect(() => {
    setValidUsername(USER_REGEX.test(username))
  }, [username]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
  }, [pwd])


  const comeTo = location.state?.from?.pathname || '/${user.username}/';
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const result = await login(username, pwd);

      console.log("Inside handleSubmit, result: ", result);
      if (result.success){
        console.log('Token after login:', localStorage.getItem('token')); 
        console.log('Auth header:', api.defaults.headers.common['Authorization']);
        navigate(comeTo, { replace: true });
      }
    }catch(error){
      setErrMsg(error.response?.data?.message || "Login failed");
      errRef.current?.focus();
    }
  }

  return (
    <div className='min-h-screen flex justify-center bg-gray-200 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 mt-20'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Sign in to your account
          </h2>
        </div>

        <p ref={errRef} className={errMsg ? "bg-red-100 text-red-700 p-3 rounded" : "hidden"} aria-live="assertive">
                    {errMsg}
        </p>
        <form
          className='mt-8 space-y-6'
          onSubmit={handleSubmit}
        >
          <div className='rounded-md shadow-sm -space-y-px'>
            <div>
              <input
                id='username'
                ref={userRef}
                type='text'
                required
                className={`appearance-none rounded-t-md relative block w-full px-3 py-4 border ${validUsername ? 'border-green-500' : username ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:ring-1 focus:z-10 sm:text-sm transition duration-300 ease-in-out transform hover:border-opacity-75 focus:border-opacity-100 shadow-sm focus:shadow-lg sm:text-lg text-lg`}
                placeholder='Username...'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setUsernameFocus(true)}
                onBlur ={() => setUsernameFocus(false)}
              
              />
            </div>

            <div className='relative'>
                <input
                  type={showPassword? 'text': 'password'}
                  required
                  className={`appearance-none rounded-t-md relative block w-full px-3 py-4 border ${validPwd ? 'border-green-500' : pwd ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:ring-1 focus:z-10 sm:text-sm transition duration-300 ease-in-out transform hover:border-opacity-75 focus:border-opacity-100 shadow-sm focus:shadow-lg sm:text-lg text-lg mt-5`}
                  placeholder='Password...'
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  onFocus={() => setPwdFocus(true)}
                  onBlur = {() => setPwdFocus(false)} 
                
                
                >
                </input>

                <span
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>

            </div>
          </div>

          <div className='space-y-2 text-sm'>
                    {usernameFocus && !validUsername && (
                        <p className='text-red-500 '>
                            <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                            4 to 24 characters<br />
                            Must begin with a letter<br />
                            Letters, numbers, underscores, hyphens allowed <br/>
                          </p>
                    )}
                    {pwdFocus && !validPwd && (
                        <p className='text-red-600 bg-gray-100 p-2 rounded'>
                            <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                            8 to 24 characters<br />
                            Must include uppercase and lowercase letters, a number and a special character<br />
                            Allowed special characters: ! @ # $ %
                        </p>
                    )}
          </div>
          <div>
            <button
              type='submit'
              disabled ={!validPwd || !validUsername}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${!validUsername || !validPwd ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
            >
              Sign in
            </button>
          </div>
          <div className='flex items-center justify-between'>
            <div className='text-sm'>
              Don't have an account? 
              <Link to="/signup" className='font-medium text-blue-600 hover:text-blue-500 ml-2'>
                   Sign up
              </Link>
            </div>
          </div>

        </form>
      </div>
    </div>
  )
}

export default Signin
