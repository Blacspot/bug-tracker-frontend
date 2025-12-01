import Navbar from "../Navbar/Navbar"
import { useForm, type SubmitHandler } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { toast } from "sonner"
import { useNavigate } from "react-router"
import { useState } from "react"
import { useDispatch } from 'react-redux'
import { registerThunk } from '../../store/authSlice'
import type { UserRole } from '../types'
import type { AppDispatch } from '../../store'

type RegisterInputs = {
    first_name: string
    last_name: string
    email: string
    password: string
    confirmPassword: string
    role: UserRole
}

const schema = yup.object({
    first_name: yup.string().max(50, 'Max 50 characters').required('First name is required'),
    last_name: yup.string().max(50, 'Max 50 characters').required('Last name is required'),
    email: yup.string().email('Invalid email').max(100, 'Max 100 characters').required('Email is required'),
    password: yup.string().min(6, 'Min 6 characters').max(255, 'Max 255 characters').required('Password is required'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], "Password must match")
        .required('Confirm password is required'),
    role: yup.string().oneOf(['Admin', 'Developer', 'Tester'], 'Invalid role').required('Role is required')
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
                username: `${data.first_name} ${data.last_name}`,
                email: data.email,
                password: data.password,
                role: data.role
            })).unwrap()
            toast.success('Registration successful')
            navigate('/verification', { state: { email: data.email } })
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
                {/* useform, yup */}


                <div className="w-full max-w-lg p-8 rounded-xl shadow-lg bg-white">
                    <h1 className="text-3xl font-bold mb-6 text-center">Account Registration</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <input
                            type="text"
                            {...register("first_name")}
                            placeholder="First Name"
                            className="input border border-gray-300 rounded w-full p-2 text-lg "
                        />
                        {
                            errors.first_name && (
                                <span className="text-red-700 text-sm">{errors.first_name.message}</span>
                            )
                        }
                        <input
                            type="text"
                            {...register("last_name")}
                            placeholder="Last Name"
                            className="input border border-gray-300 rounded w-full p-2 text-lg "

                        />
                        {
                            errors.last_name && (
                                <span className="text-red-700 text-sm">{errors.last_name.message}</span>
                            )
                        }
                        <input
                            type="email"
                            {...register("email")}
                            placeholder="Email"
                            className="input border border-gray-300 rounded w-full p-2 text-lg"

                        />
                        {
                            errors.email && (
                                <span className="text-red-700 text-sm">{errors.email.message}</span>
                            )
                        }
                        <input
                            type="password"
                            {...register("password")}
                            placeholder="Password"
                            className="input border border-gray-300 rounded w-full p-2 text-lg"
                        />
                        {
                            errors.password && (
                                <span className="text-red-700 text-sm">{errors.password.message}</span>
                            )
                        }

                        <input
                            type="password"
                            {...register('confirmPassword')}
                            placeholder="Confirm Password"
                            className='input border border-gray-300 rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg '
                        />

                        {errors.confirmPassword && (
                            <span className=" text-red-700 text-sm">{errors.confirmPassword.message}</span>
                        )}
                        <select
                            {...register("role")}
                            className="select border border-gray-300 rounded w-full p-2 text-lg"
                        >
                            <option value="">Select Role</option>
                            <option value="Admin">Admin</option>
                            <option value="Developer">Developer</option>
                            <option value="Tester">Tester</option>
                        </select>
                        {
                            errors.role && (
                                <span className="text-red-700 text-sm">{errors.role.message}</span>
                            )
                        }

                        <button type="submit" className="btn btn-primary w-full mt-4" disabled={isLoading}>
                            {
                                isLoading ? (
                                    <>
                                        <span className="loading loading-spinner text-primary" /> Please Wait....
                                    </>
                                ) : "Register"
                            }
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}
