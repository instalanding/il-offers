import React, { useState, useEffect } from "react";
import Card from "./Variants/Card";
import Capsule from "./Variants/Capsule";

interface VariantOption {
    variant_id: string;
    variant_options: {
        title?: string;
        option1?: string;
        option2?: string;
        option3?: string;
        [key: string]: string | undefined;
    };
    price: {
        offerPrice?: { value: string; prefix: string };
        originalPrice?: { value: string; prefix: string };
    };
    product_handle?: string;
    inventory: number;
}

interface VariantsComponentProps {
    value: {
        options: {
            option1: {
                enabled: boolean;
                label: string;
                displayStyle: 'card' | 'capsule';
            };
            option2: {
                enabled: boolean;
                label: string;
                displayStyle: 'card' | 'capsule';
            };
            option3: {
                enabled: boolean;
                label: string;
                displayStyle: 'card' | 'capsule';
            };
        };
    };
    style?: React.CSSProperties;
    collections: {
        variants: Array<VariantOption>;
    };
}

const VariantsComponent: React.FC<VariantsComponentProps> = ({ value, style, collections }) => {

    const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
    const [currentVariant, setCurrentVariant] = useState<string | null>(null);
    const [productHandle, setProductHandle] = useState<string | null>(null);

    const sortedVariants = [...collections.variants].sort((a, b) => {
        const priceA = a.price.offerPrice ? parseFloat(a.price.offerPrice.value) : 0;
        const priceB = b.price.offerPrice ? parseFloat(b.price.offerPrice.value) : 0;
        return priceA - priceB;
    });

    useEffect(() => {
        const initializeVariants = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const variantId = urlParams.get("variant");
            const firstInStockVariant = sortedVariants.find(v => v.inventory > 0);

            // If there's a variant ID in the URL, check if it's in stock
            const requestedVariant = variantId
                ? sortedVariants.find((v) => v.variant_id === variantId)
                : null;
            // Use the requested variant if it's in stock, otherwise use first in-stock variant
            const defaultVariant = (requestedVariant && requestedVariant.inventory > 0)
                ? requestedVariant
                : firstInStockVariant;

            if (defaultVariant) {
                const initialOptions: { [key: string]: string } = {};
                Object.entries(defaultVariant.variant_options)
                    .filter(([key, val]) => key.startsWith("option") && val)
                    .forEach(([key, val]) => {
                        initialOptions[key] = val!;
                    });

                setSelectedOptions(initialOptions);
                setCurrentVariant(defaultVariant.variant_id || null);
                setProductHandle(defaultVariant.product_handle || null);
                updateURL(defaultVariant.variant_id, defaultVariant.product_handle);
            }
        };

        initializeVariants();
    }, [collections.variants]);

    const updateURL = (variantId: string | null, handle: string | undefined) => {
        if (variantId && handle) {
            const newUrl = `/products/${handle}?variant=${variantId}`;
            window.history.pushState({}, "", newUrl);
            window.dispatchEvent(
                new CustomEvent("variantChanged", {
                    detail: { variantId },
                })
            );
        }
    };

    const handleOptionSelect = (optionKey: string, optionValue: string) => {
        const newSelections = { ...selectedOptions, [optionKey]: optionValue };

        const matchingVariant = sortedVariants.find((variant) =>
            Object.entries(newSelections).every(([key, val]) => variant.variant_options[key] === val)
        );

        if (matchingVariant) {
            setSelectedOptions(newSelections);
            setCurrentVariant(matchingVariant.variant_id || null);
            setProductHandle(matchingVariant.product_handle || null);
            updateURL(matchingVariant.variant_id, matchingVariant.product_handle);
        }
    };

    if (!sortedVariants.length) return null;

    const renderVariantOptions = () => {
        const optionGroups = sortedVariants.reduce((acc, variant) => {
            Object.entries(variant.variant_options).forEach(([key, val]) => {
                if (key.startsWith("option") && val) {
                    if (!acc[key]) acc[key] = new Set();
                    acc[key].add(val);
                }
            });
            return acc;
        }, {} as { [key: string]: Set<string> });

        return Object.entries(optionGroups)
            .sort()
            .map(([optionKey, values]) => {
                const optionConfig = value.options[optionKey as 'option1' | 'option2' | 'option3'];
                if (!optionConfig?.enabled) return null;

                const getInventoryForOption = (optionValue: string) => {
                    const variant = sortedVariants.find((v) => v.variant_options[optionKey] === optionValue);
                    return variant?.inventory;
                };

                return (
                    <div key={optionKey} className="mb-4">
                        <h3 className="text-sm font-medium mb-2">{optionConfig.label}</h3>
                        <div className={`
                            flex justify-start flex-wrap gap-2 
                            ${optionConfig.displayStyle === 'card' ? 'grid grid-cols-3' : 'flex flex-wrap'}
                        `}>
                            {Array.from(values).map((optionValue) => {
                                const variant = sortedVariants.find((v) => v.variant_options[optionKey] === optionValue);
                                const Component = optionConfig.displayStyle === 'card' ? Card : Capsule;

                                return (
                                    <Component
                                        key={optionValue}
                                        label={optionValue}
                                        value={optionValue}
                                        isSelected={selectedOptions[optionKey] === optionValue}
                                        onClick={() => {
                                            const inventory = getInventoryForOption(optionValue);
                                            if (inventory !== 0) {
                                                handleOptionSelect(optionKey, optionValue);
                                            }
                                        }}
                                        priceDetails={variant?.price}
                                        inventory={getInventoryForOption(optionValue)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                );
            });
    };

    return <div style={style} className="p-4">{renderVariantOptions()}</div>;
};

export default React.memo(VariantsComponent);