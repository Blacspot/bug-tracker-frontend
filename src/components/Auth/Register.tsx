import Navbar from "../Navbar/Navbar"
import { useForm, type SubmitHandler } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { toast } from "sonner"
import { useNavigate } from "react-router"
import { useState } from "react"
import { useDispatch } from 'react-redux'
import { registerThunk, loginThunk } from '../../store/authSlice'
import type { AppDispatch } from '../../store'

type RegisterInputs = {
    username: string
    email: string
    password: string
    confirmPassword: string
}

const schema = yup.object({
    username: yup.string().max(100, 'Max 100 characters').required('Username is required'),
    email: yup.string().email('Invalid email').max(100, 'Max 100 characters').required('Email is required'),
    password: yup.string().min(6, 'Min 6 characters').max(255, 'Max 255 characters').required('Password is required'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], "Password must match")
        .required('Confirm password is required'),
})


export const Register = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch<AppDispatch>()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterInputs>({
        resolver: yupResolver(schema)
    })

    const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
        setIsLoading(true)
        try {
            await dispatch(registerThunk({
                username: data.username,
                email: data.email,
                password: data.password
            })).unwrap()
            
            toast.success('Registration successful! Logging you in...')
            
            // Auto-login after successful registration
            try {
                await dispatch(loginThunk({
                    email: data.email,
                    password: data.password
                })).unwrap()
                
                toast.success('Welcome! Redirecting to dashboard...')
                navigate('/dashboard')
            } catch (loginError) {
                toast.error('Registration successful but login failed. Please try logging in manually.')
                navigate('/login')
            }
        } catch (error) {
            toast.error((error as string) || 'Registration failed')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Navbar />

            <div className="flex justify-center items-center min-h-screen bg-base-200 ">
                <div className="w-full max-w-lg p-8 rounded-xl shadow-lg bg-white">
                    <h1 className="text-3xl font-bold mb-6 text-center">Account Registration</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <input
                            type="text"
                            {...register("username")}
                            placeholder="Username"
                            className="input border border-gray-300 rounded w-full p-2 text-lg "
                        />
                        {errors.username && (
                            <span className="text-red-700 text-sm">{errors.username.message}</span>
                        )}
                        <input
                            type="email"
                            {...register("email")}
                            placeholder="Email"
                            className="input border border-gray-300 rounded w-full p-2 text-lg"
                        />
                        {errors.email && (
                            <span className="text-red-700 text-sm">{errors.email.message}</span>
                        )}
                        <input
                            type="password"
                            {...register("password")}
                            placeholder="Password"
                            className="input border border-gray-300 rounded w-full p-2 text-lg"
                        />
                        {errors.password && (
                            <span className="text-red-700 text-sm">{errors.password.message}</span>
                        )}

                        <input
                            type="password"
                            {...register('confirmPassword')}
                            placeholder="Confirm Password"
                            className='input border border-gray-300 rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg '
                        />
                        {errors.confirmPassword && (
                            <span className=" text-red-700 text-sm">{errors.confirmPassword.message}</span>
                        )}

                        <button type="submit" className="btn btn-primary w-full mt-4" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <span className="loading loading-spinner text-primary" /> Please Wait....
                                </>
                            ) : "Register"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}
