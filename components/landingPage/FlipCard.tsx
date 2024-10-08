import createGradient from '@/lib/createGradient'
import React from 'react'
import Image from 'next/image';
import Reedem from '../coupon/Reedem';
import QrComponent from '../coupon/QrComponent';
import { TermsAndConditions } from '../coupon/TermsAndConditions';
import { ShareDialog } from '../coupon/ShareDialog';
import { formatDate } from '@/lib/dateFormat';
import { SaveOfferDialog } from '../coupon/SaveOffer';
import Link from 'next/link';


const FlipCard = ({data, offer_id, userIp}:any) => {
  return (
    <div className='w-full h-screen flex justify-center items-center'
    style={{ backgroundImage: createGradient(data?.campaign_type === "offline" ? data?.config?.button2Color : data?.config?.button1Color) }}>
    <div className="flex flex-col items-center flip-card">
        {data?.campaign_type === "online" ?
            <p className="mb-5 text-sm text-slate-500">Tap to flip</p> : <></>
        }
        <div className="flip-card-inner">
            <div className="rounded-2xl relative flip-card-front">
                <div className="text-center bg-white pt-3 rounded-t-xl">
                    <h1 className="text-xl font-medium">🎁 {data?.creative?.title}</h1>
                </div>
                <div>
                    <img width={350} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoUAAAAxCAMAAACbMyOsAAAAgVBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9d3yJTAAAAKnRSTlMAVXfx9+WHH7eQ4JbYpJ1+afwqENPOsD3pyMN4WksxBalzT0XAXgpkGBQbNSB0AAACcUlEQVR42u3dyZKiQBSF4YsgkygKikM5z33f/wF71R67Ii2SKBI251v+i4rMSCI1xUJRor6J3J/Lx3ioRN3zq9MlKuWffeIrUZdmx91BvilzXofUndkkEpPnUYm6sd7LJ1tuh9SFWXiQzwoeU8i94Cw/ijIlcitYSo2IuyG5FVyk1j5QIoceYmGqRO6MxcpViVxZlWKlmCmRIzexNFYiN+Ziq1AiaH0r5DtD6tPqINYeSuTCSOw9lciFszQwV6L2zUppYKJE7cukiS8lal8lTXhK1L5Emrjo/9aDl1BhhByjDgcwRI5RRwoh8ho1HUCAfESdKAwgQ12g5goT5ArVH0CKfEVNFBLkq3niPnJlnniOvHgfNNQOOngfdO1qJc5WK7NdrVCaWH4+YEcKS+Nr+Nx8zPky//kIeYS6EfCRt6g7BYHYeNu8VNgZv7iRCmyQQ9RCoUAOzRNPkafmiZfI4/dBQ+2gfYFN7WoVzlYrtl2tr1/thbH3MlXIkceoqQcp8hg1V5gix6iZBwFyghoqeLBA3aDeFELkCerKgwy5Qj0pnJAr88RXyBPzxG/Im/dBQ+2gAw+y2tU6OVuthe1q5XxfSL1LpImTErXvKPy8kPo2lyYWStS+2V3slfyeKzmxE3tbJYJ+jiexErkwPIitiC/I5MhZbI2UyI21WIr4f/EEPW2GlRK5kt55QKbeJWKh4DMMySlPav3ho+PILX9fexHy3h25tir4EE3qnb+UH1xWSuReMJVPyoT3TKgjcSQmhymfJUzdCfJSvotyXoPULT/Zy8uhOIc8GVMfstF2fxeRIT+kpn75Q/4yLfWPVyH17y9A0qhgbWwsOwAAAABJRU5ErkJggg==" alt="" />
                </div>
                <div className='bg-white p-[20px] rounded-b-xl shadow-xl relative'>
                    <Image
                        alt={"Image"}
                        src={data?.creative?.image}
                        width={310}
                        height={310}
                        className="rounded-xl"
                    />
                    <div className='rounded-full overflow-hidden absolute top-[5px] left-[7px]'>
                        <Image
                            alt=""
                            src={data?.store_logo}
                            width={50}
                            height={50}
                        />
                    </div>
                    <h2 className='text-sm text-center mt-4'>{data?.creative?.text}</h2>
                </div>

                {data?.campaign_type === "offline" ?
                    <p className="mt-5 text-sm text-slate-500">Tap to flip</p> :
                    <Reedem data={data} offer_id={offer_id} userIp={userIp}/>
                }
            </div>
            <div className="rounded-2xl relative flip-card-back">
                <div className="text-center bg-white pt-3 rounded-t-xl">
                    <h1 className="text-xl font-medium">🎁 {data?.creative?.title}</h1>
                </div>
                <div>
                    <img width={350} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoUAAAAxCAMAAACbMyOsAAAAgVBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9d3yJTAAAAKnRSTlMAVXfx9+WHH7eQ4JbYpJ1+afwqENPOsD3pyMN4WksxBalzT0XAXgpkGBQbNSB0AAACcUlEQVR42u3dyZKiQBSF4YsgkygKikM5z33f/wF71R67Ii2SKBI251v+i4rMSCI1xUJRor6J3J/Lx3ioRN3zq9MlKuWffeIrUZdmx91BvilzXofUndkkEpPnUYm6sd7LJ1tuh9SFWXiQzwoeU8i94Cw/ijIlcitYSo2IuyG5FVyk1j5QIoceYmGqRO6MxcpViVxZlWKlmCmRIzexNFYiN+Ziq1AiaH0r5DtD6tPqINYeSuTCSOw9lciFszQwV6L2zUppYKJE7cukiS8lal8lTXhK1L5Emrjo/9aDl1BhhByjDgcwRI5RRwoh8ho1HUCAfESdKAwgQ12g5goT5ArVH0CKfEVNFBLkq3niPnJlnniOvHgfNNQOOngfdO1qJc5WK7NdrVCaWH4+YEcKS+Nr+Nx8zPky//kIeYS6EfCRt6g7BYHYeNu8VNgZv7iRCmyQQ9RCoUAOzRNPkafmiZfI4/dBQ+2gfYFN7WoVzlYrtl2tr1/thbH3MlXIkceoqQcp8hg1V5gix6iZBwFyghoqeLBA3aDeFELkCerKgwy5Qj0pnJAr88RXyBPzxG/Im/dBQ+2gAw+y2tU6OVuthe1q5XxfSL1LpImTErXvKPy8kPo2lyYWStS+2V3slfyeKzmxE3tbJYJ+jiexErkwPIitiC/I5MhZbI2UyI21WIr4f/EEPW2GlRK5kt55QKbeJWKh4DMMySlPav3ho+PILX9fexHy3h25tir4EE3qnb+UH1xWSuReMJVPyoT3TKgjcSQmhymfJUzdCfJSvotyXoPULT/Zy8uhOIc8GVMfstF2fxeRIT+kpn75Q/4yLfWPVyH17y9A0qhgbWwsOwAAAABJRU5ErkJggg==" alt="" />
                </div>
                <div className='bg-white p-[20px] h-[350px] rounded-b-xl shadow-xl relative'>
                    <div className="">
                        <p className='text-sm text-slate-500'>Offer Code</p>
                        <h2 className="text-orange-500 font-semibold mt-1">{data?.creative?.coupon_code}</h2>
                    </div>
                    <div className="h-[80px] flex justify-center">
                        <QrComponent redirectUrl={`https://links.instalanding.in/redirect/?offer_id=${offer_id}&advertiser_id=${data.advertiser}&tags=${data?.tags}&redirect_url=${data?.campaign_type !== "offline" ? data?.store_url : `https://vri.li/${offer_id}`}`} />
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                        <TermsAndConditions data={data?.creative?.terms_and_conditions} />
                        <ShareDialog shareLink={`https://vri.li/${offer_id}`} offer_id={offer_id} />
                    </div>
                    <div className='text-left mt-2'>
                        <h3 className='text-xs font-semibold'>Description</h3>
                        <p className='text-[10px]'>{data?.store_description}</p>
                        <div className="flex items-center justify-between mt-2 gap-4">
                            <div className="">
                                <h3 className='text-xs font-semibold'>Valid Date:</h3>
                                <p className='text-[10px]'>{formatDate(data?.creative.start_date)}-{formatDate(data?.creative.end_date)}</p>
                            </div>
                        </div>
                        <div className='w-full flex justify-center mt-4'>
                            <SaveOfferDialog
                                buttonText={data?.config?.button2Text}
                                bgColor={data?.config?.button1Color}
                                offer_id={offer_id}
                                product_url={data?.store_url}
                                data={data}
                                advertiser_id={data.advertiser}
                                coupon_code={data?.creative?.coupon_code}
                                userIp={userIp}
                            />
                        </div>
                    </div>
                </div>
                {data?.campaign_type === "offline" ?
                    <p className="mt-5 text-sm text-slate-500">Tap to flip</p> :
                    <Reedem data={data} offer_id={offer_id} />
                }
            </div>
        </div>
    </div>
    <Link href="https://instalanding.in" target='_blank'>
        <p className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-2 text-slate-600 text-sm cursor-pointer">Powered by Viralmint</p>
    </Link>
</div>
  )
}

export default FlipCard