import Navbar from "../Navbar/Navbar"
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";
import { verifyEmailThunk, resendVerificationThunk } from "../../store/authSlice";

type VerifyInputs = {
    email: string;
    code: string;
};

const schema = yup.object({
    email: yup.string().email('Invalid email').max(100, 'Max 100 characters').required('Email is required'),
    code: yup.string().min(6, 'Min 6 characters').required('Code is required'),
});

export const Verification = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch<AppDispatch>()
    const [isLoading, setIsLoading] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [countdown, setCountdown] = useState(0)

    const emailState = location.state?.email || ''

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors }
    } = useForm<VerifyInputs>({
        resolver: yupResolver(schema),
        defaultValues: {
            email: emailState
        }
    })

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    const onSubmit: SubmitHandler<VerifyInputs> = async (data) => {
        setIsLoading(true)
        try {
            await dispatch(verifyEmailThunk({ email: data.email, code: data.code })).unwrap()
            toast.success('Email verified successfully!')
            navigate('/login')
        } catch (error) {
            toast.error(error as string || 'Verification failed')
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendCode = async () => {
        const email = getValues('email')
        if (!email) {
            toast.error('Please enter your email first')
            return
        }
        setIsResending(true)
        try {
            await dispatch(resendVerificationThunk({ email })).unwrap()
            toast.success('Verification code resent!')
            setCountdown(60) // 60 second cooldown
        } catch (error) {
            toast.error(error as string || 'Failed to resend code')
        } finally {
            setIsResending(false)
        }
    }

    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center min-h-screen bg-base-200 ">
                <div className="w-full max-w-lg p-8 rounded-xl shadow-lg bg-white">
                    <h1 className="text-3xl font-bold mb-6 text-center">Verify your Account</h1>
                    <p className="text-gray-600 text-center mb-6">
                        We've sent a verification code to your email. Please enter it below.
                    </p>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <input
                            type="email"
                            {...register("email")}
                            placeholder="Email"
                            className="input border border-gray-300 rounded w-full p-2 text-lg"
                        />
                        {errors.email && (
                            <span className="text-sm text-red-700">{errors.email.message}</span>
                        )}

                        <input
                            type="text"
                            {...register("code")}
                            placeholder="Verification Code"
                            className="input border border-gray-300 rounded w-full p-2 text-lg"
                        />
                        {errors.code && (
                            <span className="text-sm text-red-700">{errors.code.message}</span>
                        )}

                        <button type="submit" className="btn btn-primary w-full mt-4" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <span className="loading loading-spinner text-primary" /> Verifying....
                                </>
                            ) : "Verify your Account"}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <button
                            type="button"
                            onClick={handleResendCode}
                            disabled={isResending || countdown > 0}
                            className="btn btn-outline btn-sm"
                        >
                            {isResending ? (
                                <>
                                    <span className="loading loading-spinner loading-xs" /> Sending...
                                </>
                            ) : countdown > 0 ? (
                                `Resend Code (${countdown}s)`
                            ) : (
                                "Resend Code"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
