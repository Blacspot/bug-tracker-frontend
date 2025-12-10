import Navbar from "../Navbar/Navbar"
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";
import { loginThunk } from "../../store/authSlice";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

type LoginInputs = {
  email: string;
  password: string;
}

const schema = yup.object({
    email: yup.string().email('Invalid email').max(100, 'Max 100 characters').required('Email is required'),
    password: yup.string().min(6, 'Min 6 characters').max(20, 'Max 20 characters').required('Password is required'),
});

export const Loginform = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Clear any pending verification data that wasn't used (expired/older sessions)
    localStorage.removeItem('pendingVerification')
    localStorage.removeItem('pendingLoginEmail')
    localStorage.removeItem('verifiedEmails')
  }, [])

   const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginInputs>({
        resolver: yupResolver(schema)
    })

      // Add this to your Loginform.tsx temporarily for debugging

const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
  setIsLoading(true)
  try {
    const result = await dispatch(loginThunk(data)).unwrap()
    
    // DEBUG: Log the full response
    console.log('=== LOGIN RESPONSE ===');
    console.log('Full result:', result);
    console.log('User object:', result.user);
    console.log('User role:', result.user?.role);
    console.log('Token:', result.token);
    console.log('====================');
    
    // Check localStorage
    const storedUser = localStorage.getItem('user');
    console.log('=== LOCALSTORAGE ===');
    console.log('Stored user:', storedUser);
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      console.log('Parsed user:', parsed);
      console.log('Parsed role:', parsed.role);
    }
    console.log('====================');
    
    toast.success("Login successful")
    localStorage.removeItem('pendingLoginEmail')
    localStorage.removeItem('pendingVerification')
    
    navigate('/dashboard')
  } catch (error) {
    console.error('Login error:', error);
    toast.error((error as string) || 'Login failed')
  } finally {
    setIsLoading(false)
  }
}

  return (
    <div>
      <Navbar />
       <div className="flex justify-center items-center min-h-screen bg-base-200 ">
                <div className="w-full max-w-lg p-8 rounded-xl shadow-lg bg-white">
                    <h1 className="text-3xl font-bold mb-6 text-center" data-test="bug-login-header">Login</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" data-test="bug-login-form">
                      <input
                      data-test="bug-login-email" 
                      type="email"
                      {...register("email")}
                      placeholder="Email"
                      className="input border border-gray-300 rounded w-full p-2 text-lg"
                      />

                        {errors.email && (
                            <span className="text-sm  text-red-700">{errors.email.message}</span>
                        )}

                        <input
                            data-test="bug-login-password"
                            type="password"
                            {...register("password")}
                            placeholder="Password"
                            className="input border border-gray-300 rounded w-full p-2 text-lg"

                        />
                         {errors.password && (
                            <span className="text-sm text-red-700">{errors.password.message}</span>
                        )}

                         <button data-test="bug-login-submit" type="submit" className="btn btn-primary w-full mt-4" disabled={isLoading}>
                            {
                                isLoading ? (
                                    <>
                                        <span className="loading loading-spinner text-primary" /> Please wait...
                                    </>
                                ) : "Login"
                            }
                        </button>

                    </form>
                </div>
          </div>
    </div>
  )
}

