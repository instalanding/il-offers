"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { BiSolidOffer } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import { handleSendOtp, handleVerifyOtp } from "@/lib/otpless";
import { OTPInput } from "input-otp";
import { Slot } from "../../ui/input-otp";
import Address from "./components/Address";
import { useToast } from "@/hooks/use-toast";
import BottomDrawer from "./components/BottomDrawer";
import axios from "axios";
import { CgAdd } from "react-icons/cg";
import LoadingScreen from "./components/LoadingScreen";
import ChangeAddress from "./components/ChangeAddress";
import { calculateDiscount } from "@/lib/calculateDiscount";
import OtpInput from "./components/OtpInput";
import PhoneNumber from "./components/PhoneNumber";
import PaymentMethods from "./components/PaymentMethods";

type AddressType = {
  id: string;
  pincode: string;
  first_name: string;
  last_name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  email: string;
};

const InstalandingCheckout = ({ logo, schema, setOpen, open, offer_id }: any) => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [showOtpInput, setShowOtpInput] = useState<boolean>(false);
  const [isOtpVerified, setOtpIsVerified] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [requestId, setRequestId] = useState<string>("");
  const [newAddress, setNewAddress] = useState<boolean>(false);
  const [addressId, setAddressId] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [otpVerifying, setOtpVerifying] = useState<boolean>(false);
  const [render, setRender] = useState(false);
  const [addresses, setAddresses] = useState<any>([
   
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const [selectedAddress, setSelectedAddress] = useState<AddressType>();
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth", // Optional: Adds smooth scrolling effect
      });
    }
  };

  useEffect(() => {
    if (addressId !== "") {
      scrollToBottom();
    }
  }, [addressId]);

  const handleAddPhoneNumber = async (e: any) => {
    const input = e.target.value;
    if (/^\d{0,10}$/.test(input)) {
      setPhoneNumber(input);
      if (input.length === 10) {
        setIsVerifying(true);
        try {
          const { data } = await axios.get(`api/users?phone_number=${input}`);
          setUserId(data.data.id);
          setOtpIsVerified(data.data.is_verified);
        } catch (err: any) {
          console.log(err);
          if (err.message === "Request failed with status code 404") {
            setShowOtpInput(true);
            const res = await handleSendOtp(input);
            setRequestId(res.requestId);
          }
        } finally {
          setIsVerifying(false);
        }
      }
    }
  };

  const handleAddOtp = async (value: string) => {
    if (value.length === 4) {
      setOtpVerifying(true);
      const res = await handleVerifyOtp(value, requestId);
      if (res?.response?.status === 400) {
        toast({
          variant: "destructive",
          description: res.response.data.description,
        });
      }
      setOtpIsVerified(res.isOTPVerified);
      try {
        const { data } = await axios.post("api/users", {
          phone_number: phoneNumber,
          is_verified: res.isOTPVerified || false,
        });
        setUserId(data.data.user.id);
        setAddresses(data.data.addresses);
        toast({
          description: "OTP verified successfully",
        });
      } catch (err) {
        console.log(err);
      } finally {
        setOtpVerifying(false);
      }
    }
  };

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      if (!userId) return;
      const { data } = await axios.get(`api/address?user_id=${userId}`);
      setAddresses(data.data);
      setAddressId(data.data[0].id);
      setSelectedAddress(data.data[0]);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAddresses();
    }
  }, [userId, render]);

  const fetchSelectedAddress = async () => {
    try {
      if (!userId) return;
      const { data } = await axios.get(
        `api/address?user_id=${userId}&id=${addressId}`
      );
      setAddressId(data.data[0].id);
      setSelectedAddress(data.data[0]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (addressId) {
      fetchSelectedAddress();
    }
  }, [render, addressId]);

  return (
    <>
      {schema.templateType === "new-landing" ? (
        <></>
      ) : (
        <Button
          onClick={() => {
            setOpen(true);
          }}
          className="w-full rounded-full mt-2 py-8"
        >
          Initiate Checkout
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="w-full"></DialogTrigger>
        <DialogContent className="w-full h-[100dvh] bg-[#f5f6fb] p-0 flex items-center flex-col">
          {isLoading || isVerifying || otpVerifying ? <LoadingScreen /> : null}
          <div className="bg-white w-full pb-2">
            <div className="flex justify-center items-center">
              <Image
                alt={`logo`}
                src={logo}
                width={50}
                height={50}
                className="w-[80px] height-auto object-contain py-3"
              />
            </div>
            <DialogTitle className="w-full rounded-full text-left text-sm px-4">
              Instant checkout
            </DialogTitle>
          </div>
          <div
            className="w-full h-[100vh] overflow-y-auto p-4"
            ref={containerRef}
          >
            <BottomDrawer schema={schema} />
            <Accordion
              type="single"
              defaultValue="item-2"
              collapsible
              className="w-full"
            >
              <AccordionItem value="item-2" className="mt-4">
                <AccordionTrigger className="p-3">
                  Coupons & Rewards
                </AccordionTrigger>
                <AccordionContent className="p-3 flex items-end gap-4">
                  <div className="flex items-start gap-3">
                    <BiSolidOffer
                      size={60}
                      className="text-green-700 mt-[-0.7rem]"
                    />
                    <div>
                      <h2 className="text-[13px] font-medium">
                        Save upto ₹399 on this product
                      </h2>
                      <p className="text-[12px] mt-1">
                        We have selected the best coupon based on your
                        preferences
                      </p>
                    </div>
                  </div>
                  <Button size="sm">Apply</Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {isOtpVerified ? (
              <div className="mt-5">
                <div className="flex justify-between items-center">
                  <h2 className="text-[13px] font-medium">Select address</h2>
                  <button
                    onClick={() => setNewAddress(!newAddress)}
                    className="border border-black border-dashed text-[13px] px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    <CgAdd size={18} />
                    Add new address
                  </button>
                </div>
                {newAddress ? (
                  <Address
                    userId={userId}
                    setNewAddress={setNewAddress}
                    setRender={setRender}
                    render={render}
                  />
                ) : (
                  <ChangeAddress
                    address={selectedAddress}
                    setAddressId={setAddressId}
                    addressId={addressId}
                    addresses={addresses}
                    selectedAddress={selectedAddress}
                  />
                )}
              </div>
            ) : (
              <>
                {showOtpInput ? (
                  <OtpInput
                    phoneNumber={phoneNumber}
                    handleAddOtp={handleAddOtp}
                    isLoading={isLoading}
                  />
                ) : (
                  <PhoneNumber
                    phoneNumber={phoneNumber}
                    handleAddPhoneNumber={handleAddPhoneNumber}
                  />
                )}
              </>
            )}
            {addressId !== "" ? (
              <PaymentMethods
                finalPrice={
                  calculateDiscount(Number(schema.price.offerPrice.value), 10)
                    .discountPrice
                }
                codCharge={schema?.price?.codCharge?.value}
                offer_id={offer_id}
                address={selectedAddress}
                userId={userId}
                phoneNumber={phoneNumber}
              />
            ) : (
              <></>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default InstalandingCheckout;
