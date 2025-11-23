import Navbar from "../Navbar/Navbar"
import { useForm, type SubmitHandler } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { toast } from "sonner"
import { useNavigate } from "react-router"
import { useState } from "react"

type RegisterInputs = {
    first_name: string
    last_name: string
    email: string
    phone_number: string
    password: string
    confirmPassword: string
}

const schema = yup.object({
    first_name: yup.string().max(50, 'Max 50 characters').required('First name is required'),
    last_name: yup.string().max(50, 'Max 50 characters').required('Last name is required'),
    email: yup.string().email('Invalid email').max(100, 'Max 100 characters').required('Email is required'),
    phone_number: yup.string().max(20, 'Max 20 characters').required('Phone number is required'),
    password: yup.string().min(6, 'Min 6 characters').max(255, 'Max 255 characters').required('Password is required'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], "Password must match")
        .required('Confirm password is required')
})


export const Register = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    // Mock create user function
    const createUser = async () => {
        return new Promise<{ message: string }>((resolve) => {
            setTimeout(() => {
                resolve({
                    message: "Registration successful"
                })
            }, 1000)
        })
    }
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
            const response = await createUser()
            // console.log("Response", response);
            toast.success(response.message)

            // redirect the user to home for now
            setTimeout(() => {
                navigate('/')
            }, 2000)
            setIsLoading(false)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            // console.log("Error", error);
            toast.error(error.data?.error || 'Registration failed')
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
                            type="text"
                            {...register("phone_number")}
                            placeholder="Phone Number"
                            className="input border border-gray-300 rounded w-full p-2 text-lg"

                        />
                        {
                            errors.phone_number && (
                                <span className="text-red-700 text-sm">{errors.phone_number.message}</span>
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
