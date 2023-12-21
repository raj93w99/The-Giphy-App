'use client'
import { useState } from 'react';
import {useSignInWithEmailAndPassword} from 'react-firebase-hooks/auth';
import {auth} from '@/app/firebase/config'
import { useRouter } from 'next/navigation';
 
const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [SignInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router =  useRouter();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await SignInWithEmailAndPassword(email, password);
        console.log({res});
        sessionStorage.setItem('user', true);
        setEmail('');
        setPassword('');
        router.push('/');
    } catch(e){
        console.log(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-md shadow-md w-96">
        <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="text-white block mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="text-white block mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
