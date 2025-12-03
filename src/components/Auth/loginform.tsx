import Navbar from "../Navbar/Navbar"
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";
import { loginThunk } from "../../store/authSlice";
import { useNavigate } from "react-router";
import { useState } from "react";

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

   const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginInputs>({
        resolver: yupResolver(schema)
    })

      const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
        setIsLoading(true)
        try {
            await dispatch(loginThunk(data)).unwrap()
            toast.success("Login successful")
            navigate('/dashboard')
        } catch (error) {
            const errorMessage = error as string
            
            // Enhanced verification error handling
            if (errorMessage.toLowerCase().includes('not verified') || 
                errorMessage.toLowerCase().includes('verify your email') ||
                errorMessage.toLowerCase().includes('email not verified') ||
                errorMessage.toLowerCase().includes('verification required')) {
                
                toast.error('Please verify your email before logging in')
                navigate('/verification', { state: { email: data.email } })
            } else {
                toast.error(errorMessage || 'Login failed')
            }
        } finally {
            setIsLoading(false)
        }
    }

  return (
    <div>
      <Navbar />
       <div className="flex justify-center items-center min-h-screen bg-base-200 ">
                <div className="w-full max-w-lg p-8 rounded-xl shadow-lg bg-white">
                    <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <input type="email"
                      {...register("email")}
                      placeholder="Email"
                      className="input border border-gray-300 rounded w-full p-2 text-lg"
                      />

                        {errors.email && (
                            <span className="text-sm  text-red-700">{errors.email.message}</span>
                        )}

                        <input
                            type="password"
                            {...register("password")}
                            placeholder="Password"
                            className="input border border-gray-300 rounded w-full p-2 text-lg"

                        />
                         {errors.password && (
                            <span className="text-sm text-red-700">{errors.password.message}</span>
                        )}

                         <button type="submit" className="btn btn-primary w-full mt-4" disabled={isLoading}>
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

