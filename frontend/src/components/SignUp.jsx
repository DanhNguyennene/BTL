import React, {useState, useRef, useEffect} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaFontAwesome } from 'react-icons/fa6';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import api from '../api/axios'

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10}$/;



const SignUp = () => {
    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);


    const [username, setUsername] = useState('');
    const [validUsername, setValidUsername] = useState(false);
    const [usernameFocus, setUsernameFocus] = useState(false);

    const [name, setName] = useState('');
    const [validName, setValidName] = useState('');
    const [nameFocus, setNameFocus] = useState('');

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState('');
    const [emailFocus, setEmailFocus] = useState('');

    const [phone, setPhone] = useState('');
    const [validPhone, setValidPhone] = useState(false);
    const [phoneFocus, setPhoneFocus] = useState(false);

    const [address, setAddress] = useState('');
    const [validAddress, setValidAddress] = useState(false);
    const [addressFocus, setAddressFocus] = useState(false);

    const [bankAccount, setBankAccount] = useState('');
    const [validBankAccount, setValidBankAccount] = useState(false);
    const [bankAccountFocus, setBankAccountFocus] = useState(false);

    const [error, setError] = useState('');

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatchPwd, setValidMatchPwd] = useState(false);
    const [matchPwdFocus, setMatchPwdFocus] = useState(false);

    const [successMsg, setSuccessMsg] = useState('');
    const [submitted, setSubmitted] = useState(false);
    

    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current?.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    },[username, name, email, phone, address, bankAccount, pwd])

    useEffect(() => {
        const result = USER_REGEX.test(username)
        console.log(username)
        console.log(result)
        setValidUsername(result);
    }, [username])

    useEffect(() => {
        setValidName(name.length >=2 );
    }, [name]);


    useEffect(() => {
       setValidPhone(PHONE_REGEX.test(phone)); 
    }, [phone]);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    useEffect(()=>{
        setValidAddress(address.length >=5);
    }, [address])

    useEffect(()=>{
        setValidBankAccount(bankAccount.length >=5)
    });

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatchPwd(pwd === matchPwd);

    }, [pwd, matchPwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        try{
            const response = await api.post('/api/users/signup', {
                username,
                name,
                phone_number: phone,
                email,
                password: pwd,
                address,
                bank_acc: bankAccount
            });

            const data = response.data;

    
            if(data.success){
                
                setSuccessMsg("Registration successful! Redirecting to login...");
                setTimeout(() => {
                    navigate('/signin');
                }, 1500);
            }
        }catch(error){
            setErrMsg(error.message);
            errRef.current.focus();
        }
    }
  return (
    <div className='min-h-screen flex justify-center bg-gray-200 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-12 mt-20'>
            <div>
                <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900 '>
                    Create Your Account
                </h2>
            </div>
            <p ref={errRef} className={errMsg ? "bg-red-100 text-red-700 p-3 rounded" : "hidden"} aria-live="assertive">
                {errMsg}
            </p>
            
            <form className='mt-8 space-y-6' onSubmit={handleSubmit} >
                <div className='rounded-md shadow-sm -space-y-px'>
                    <div className='relative'>
                    <input
                        id='username'
                        ref={userRef}
                        type='text'
                        required
                        className={`appearance-none rounded-t-md relative block w-full px-3 py-4 border ${submitted && !validUsername ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:ring-1 focus:z-10 sm:text-sm transition duration-300 ease-in-out transform hover:border-opacity-75 focus:border-opacity-100 shadow-sm focus:shadow-lg sm:text-lg text-lg`}
                        placeholder='Username...'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onFocus={() => setUsernameFocus(true)}
                        onBlur={() => setUsernameFocus(false)}
                    />
                    {submitted && !validUsername && (
                        <p className='text-red-600 mt-2'>
                            <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                            Username is already taken. Please choose another one.
                        </p>
                    )}
                    </div>

                    <div>
                        <input
                            type='text'
                            required
                            className={`appearance-none rounded-t-md relative block w-full px-3 py-4 border ${validName ? 'border-green-500' : name ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:ring-1 focus:z-10 sm:text-sm transition duration-300 ease-in-out transform hover:border-opacity-75 focus:border-opacity-100 shadow-sm focus:shadow-lg mt-7 sm:text-lg text-lg`}
                            placeholder='Fullname...'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onFocus={() => setNameFocus(true)}
                            onBlur = {() => setNameFocus(false)} 
                        >  
                        </input>
                    </div>


                    <div>
                        <input
                            type='email'
                            required
                            className={`appearance-none rounded-t-md relative block w-full px-3 py-4 border ${validEmail ? 'border-green-500' : email ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:ring-1 focus:z-10 sm:text-sm transition duration-300 ease-in-out transform hover:border-opacity-75 focus:border-opacity-100 shadow-sm focus:shadow-lg mt-7 sm:text-lg text-lg`}
                            placeholder='Email...'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setEmailFocus(true)}
                            onBlur = {() => setEmailFocus(false)} 
                        >  
                        </input>
                    </div>

                    <div>
                        <input
                            type='tel'
                            required
                            className={`appearance-none rounded-t-md relative block w-full px-3 py-4 border ${validPhone ? 'border-green-500' : phone ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:ring-1 focus:z-10 sm:text-sm transition duration-300 ease-in-out transform hover:border-opacity-75 focus:border-opacity-100 shadow-sm focus:shadow-lg mt-7 sm:text-lg text-lg`}
                            placeholder='Phone number...'
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            onFocus={() => setPhoneFocus(true)}
                            onBlur = {() => setPhoneFocus(false)} 
                        >  
                        </input>
                    </div>

                    <div>
                        <input
                            type='text'
                            required
                            className={`appearance-none rounded-t-md relative block w-full px-3 py-4 border ${validAddress ? 'border-green-500' : address ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:ring-1 focus:z-10 sm:text-sm transition duration-300 ease-in-out transform hover:border-opacity-75 focus:border-opacity-100 shadow-sm focus:shadow-lg mt-7 sm:text-lg text-lg`}
                            placeholder='Home Address...'
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            onFocus={() => setAddressFocus(true)}
                            onBlur = {() => setAddressFocus(false)} 
                        >  
                        </input>
                    </div>
                    <div>
                        <input
                            type='text'
                            required
                            className={`appearance-none rounded-t-md relative block w-full px-3 py-4 border ${validBankAccount ? 'border-green-500' : bankAccount ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:ring-1 focus:z-10 sm:text-sm transition duration-300 ease-in-out transform hover:border-opacity-75 focus:border-opacity-100 shadow-sm focus:shadow-lg mt-7 sm:text-lg text-lg`}
                            placeholder='Bank Acc...'
                            value={bankAccount}
                            onChange={(e) => setBankAccount(e.target.value)}
                            onFocus={() => setBankAccountFocus(true)}
                            onBlur = {() => setBankAccountFocus(false)} 
                        >  
                        </input>
                    </div>

                    <div className='relative'>
                        <input
                            type={showPassword1 ? 'text' : 'password'}
                            required
                            className={`appearance-none rounded-t-md relative block w-full px-3 py-4 border ${validPwd  ? 'border-green-500' : pwd  ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:ring-1 focus:z-10 sm:text-sm transition duration-300 ease-in-out transform hover:border-opacity-75 focus:border-opacity-100 shadow-sm focus:shadow-lg mt-7 sm:text-lg text-lg`}
                            placeholder='Password...'
                            value={pwd}
                            onChange={(e) => setPwd(e.target.value)}
                            onFocus={() => setPwdFocus(true)}
                            onBlur = {() => setPwdFocus(false)} 
                        >
                        
                        </input>
                        <span
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                            onClick={() => setShowPassword1(!showPassword1)}
                        >
                            <FontAwesomeIcon icon={showPassword1 ? faEyeSlash : faEye} />
                        </span>

                    </div>

                    <div className='relative'>
                        <input 
                            type={showPassword2 ? 'text' : 'password'}
                            required
                            className={`appearance-none rounded-t-md relative block w-full px-3 py-4 border ${validMatchPwd && matchPwd  ? 'border-green-500' : matchPwd   ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:ring-1 focus:z-10 sm:text-sm transition duration-300 ease-in-out transform hover:border-opacity-75 focus:border-opacity-100 shadow-sm focus:shadow-lg mt-7 sm:text-lg text-lg`}
                            placeholder='Confirm Password...'
                            value={matchPwd}
                            onChange={(e) => setMatchPwd(e.target.value)}
                            onFocus={() => setMatchPwdFocus(true)}
                            onBlur = {() => setMatchPwdFocus(false)} 
                        
                        >
                        </input>
                        <span
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                            onClick={() => setShowPassword2(!showPassword2)}
                        >
                            <FontAwesomeIcon icon={showPassword2 ? faEyeSlash : faEye} />
                        </span>
                    </div>
                </div>

                <div className='space-y-2 text-sm'>
                        {usernameFocus && !validUsername && (
                            <p className='text-red-500 '>
                                <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                                4 to 24 characters<br />
                                Must begin with a letter<br />
                                Letters, numbers, underscores, hyphens allowed
                            </p>
                        )}

                        {emailFocus && !validEmail && (
                            <p className='text-red-500'>

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
                    disabled={!validUsername || !validName || !validEmail || !validPhone || !validPwd || !validMatchPwd || !validAddress || !validBankAccount}
                    className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${!validUsername || !validName || !validEmail || !validPhone || !validPwd || !validMatchPwd ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
                    >
                        Sign in
                    </button>
                </div>

                {successMsg && (
                    <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                        {successMsg}
                    </div>
                )}

                <div className='text-center'>
                        <p className='text-sm text-gray-600'>
                            Already have an account, or you are an admin?{' '}
                            <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-500">
                                Sign in
                            </Link>
                        </p>
                </div>
            </form>
        </div>
    </div>
  )
}

export default SignUp
