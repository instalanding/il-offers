import React, { useState, useEffect } from "react";
import Card from "./Variants/Card";
import Capsule from "./Variants/Capsule";

interface VariantOption {
    variant_id: string;
    variant_options: {
        title?: string;
        option1?: string;
        option2?: string;
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
        variant: "size" | "quantity";
        collections: {
            variants: Array<VariantOption>;
        };
    };
    style?: React.CSSProperties;
}

const VariantsComponent: React.FC<VariantsComponentProps> = ({ value, style }) => {
    const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
    const [currentVariant, setCurrentVariant] = useState<string | null>(null);
    const [productHandle, setProductHandle] = useState<string | null>(null);

    // Sort variants by price (if both offerPrice and originalPrice exist)
    const sortedVariants = [...value.collections.variants].sort((a, b) => {
        const priceA = a.price.offerPrice ? parseFloat(a.price.offerPrice.value) : 0;
        const priceB = b.price.offerPrice ? parseFloat(b.price.offerPrice.value) : 0;
        return priceA - priceB;
    });

    useEffect(() => {
        const initializeVariants = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const variantId = urlParams.get("variant");

            const defaultVariant = variantId
                ? sortedVariants.find((v) => v.variant_id === variantId)
                : sortedVariants[0];

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
    }, [value.collections.variants]);

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
            updateURL(matchingVariant.variant_id, matchingVariant.product_handle);
        }
    };

    if (!sortedVariants.length) return null;

    const renderVariantOptions = () => {
        if (value.variant === "quantity") {
            return (
                <div className="mb-4">
                    <div className="grid grid-cols-3 gap-2">
                        {sortedVariants.map((variant) => (
                            <Card
                                key={variant.variant_id}
                                label="Quantity"
                                value={variant.variant_options.option1 || ""}
                                isSelected={currentVariant === variant.variant_id}
                                onClick={() => {
                                    if (variant.inventory !== 0) {
                                        setCurrentVariant(variant.variant_id);
                                        updateURL(variant.variant_id, variant.product_handle);
                                    }
                                }}
                                priceDetails={variant.price}
                                inventory={variant.inventory}
                            />
                        ))}
                    </div>
                </div>
            );
        }

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
                const getInventoryForOption = (optionValue: string) => {
                    const variant = sortedVariants.find((v) => v.variant_options[optionKey] === optionValue);
                    return variant?.inventory;
                };

                return (
                    <div key={optionKey} className="mb-4">
                        <div className="flex flex-wrap justify-center gap-2">
                            {Array.from(values).map((optionValue) => (
                                <Capsule
                                    key={optionValue}
                                    label={optionKey}
                                    value={optionValue}
                                    isSelected={selectedOptions[optionKey] === optionValue}
                                    onClick={() => {
                                        const inventory = getInventoryForOption(optionValue);
                                        if (inventory !== 0) {
                                            handleOptionSelect(optionKey, optionValue);
                                        }
                                    }}
                                    inventory={getInventoryForOption(optionValue)}
                                />
                            ))}
                        </div>
                    </div>
                );
            });
    };

    return <div style={style} className="p-4">{renderVariantOptions()}</div>;
};

export default React.memo(VariantsComponent);