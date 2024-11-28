import React, { useState } from 'react'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import Image from 'next/image';


const OTPModal = ({ accountId, email }: { accountId: string, email: string }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {

        } catch (error) {
            console.log("Failed to verify OTP", error);
        }
        setIsLoading(false);
    }

    const handleResendOtp = async () => {

    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent className='shad-alert-dialog'>
                <AlertDialogHeader className='relative flex justify-center'>
                    <AlertDialogTitle className='h2 text-center'>
                        Enter Your OTP
                        <Image 
                            src="/assets/icons/close-dark.svg"
                            alt='close'
                            width={20}
                            height={20}
                            onClick={() => setIsOpen(false)}
                            className="otp-close-button"
                        />
                    </AlertDialogTitle>
                    <AlertDialogDescription className='subtitle-2 text-center text-light-100'>
                        OTP sent to {" "}
                        <span className='pl-1 text-brand'>{email}</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <InputOTP maxLength={6} value={password} onChange={setPassword}>
                    <InputOTPGroup className='shad-otp'>
                        <InputOTPSlot index={0} className='shad-otp-slot' />
                        <InputOTPSlot index={1} className='shad-otp-slot' />
                        <InputOTPSlot index={2} className='shad-otp-slot' />
                        <InputOTPSlot index={3} className='shad-otp-slot' />
                        <InputOTPSlot index={4} className='shad-otp-slot' />
                        <InputOTPSlot index={5} className='shad-otp-slot' />
                    </InputOTPGroup>
                </InputOTP>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}

export default OTPModal