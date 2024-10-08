import { Slot } from '@/components/ui/input-otp'
import { OTPInput } from 'input-otp'
import React from 'react'

const OtpInput = ({phoneNumber, handleAddOtp, isLoading}:any) => {
  return (
    <div className="bg-white w-full rounded-xl p-3 mt-4">
    <h2 className="text-[14px] font-medium">
      Verify phone number
    </h2>
    <p className="text-[12px] text-gray-500 mt-1">
      4-digit OTP sent to +91 {phoneNumber}
    </p>
    <OTPInput
      onChange={(value) => handleAddOtp(value)}
      maxLength={4}
      containerClassName="group flex items-center has-[:disabled]:opacity-30 mt-4"
      render={({ slots }) => (
        <>
          <div className="flex justify-around w-full">
            {slots.map((slot, idx) => (
              <Slot key={idx} {...slot} />
            ))}
          </div>
        </>
      )}
    />
    {isLoading ? (
      <p className="text-[12px] text-gray-500 text-center mt-3">
        Verifying otp...
      </p>
    ) : (
      <></>
    )}
    <p className="text-black text-[12px] font-medium mt-3">
      Resend OTP in <span className="text-blue-500">22s</span>
    </p>
    <p className="text-[12px] text-gray-500 mt-1">
      By proceeding, you are agreeing to our{" "}
      <span className="text-black ">Terms & conditions</span>{" "}
      and
      <span className="text-black "> Privacy policy</span>
    </p>
  </div>
  )
}

export default OtpInput