import React from 'react';
import IframeResizer from "@iframe-resizer/react";

interface ProductDetailsProps {
    showDefault: boolean;
    currentSchema: {
        creative: {
            terms_and_conditions?: string;
        };
        offer_id: string;
        store_description: string;
    };
    offer_ids: string[];
    iframeUrl: string | null;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ showDefault, currentSchema, offer_ids, iframeUrl }) => {
    const { creative, offer_id, store_description } = currentSchema;
    const termsAndConditions = creative.terms_and_conditions;

    return (
        <>
            {store_description && (
                <div className="my-3 bg-white px-4 rounded-lg">
                    <div
                        className="text-editor-css"
                        dangerouslySetInnerHTML={{
                            __html: store_description,
                        }}
                    ></div>
                </div>
            )}
            {showDefault ? (
                termsAndConditions && (
                    <div className={`my-3 ${offer_ids.includes(offer_id) ? "bg-[#122442]" : "bg-white"} px-4 rounded-lg`}>
                        <div
                            className="text-editor-css"
                            dangerouslySetInnerHTML={{
                                __html: termsAndConditions,
                            }}
                        ></div>
                    </div>
                )
            ) : (
                <div className="">
                    <div className={`${offer_ids.includes(offer_id) ? "text-white" : "text-black"}`}>
                        {iframeUrl ? (
                            <div className="my-3 border border-green-200">
                                <IframeResizer
                                    license="GPLv3"
                                    src={iframeUrl}
                                    width="100%"
                                    title="Variance Content"
                                    style={{ width: "100%", height: "100vh" }}
                                    className='border border-red-200'
                                />
                            </div>
                        ) : (
                            termsAndConditions && (
                                <div className={` ${offer_ids.includes(offer_id) ? "bg-[#122442]" : "bg-white"} rounded-lg`}>
                                    <div
                                        className="text-editor-css"
                                        dangerouslySetInnerHTML={{
                                            __html: termsAndConditions,
                                        }}
                                    ></div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductDetails;
