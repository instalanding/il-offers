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
    collections?: {
        variants?: Array<VariantOption>;
    };
}

const VariantsComponent: React.FC<VariantsComponentProps> = ({ value, style, collections }) => {
    const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
    const [currentVariant, setCurrentVariant] = useState<string | null>(null);
    const [productHandle, setProductHandle] = useState<string | null>(null);

    // Move sortedVariants inside useEffect or memoize it
    const sortedVariants = React.useMemo(() => {
        if (!collections?.variants || collections.variants.length === 0) {
            return [];
        }
        return [...collections.variants].sort((a, b) => {
            if (a.product_handle === 'cureveda-pro-vegan-plant-protein') {
                if (a.variant_options.option1?.toLowerCase() === 'strawberry' &&
                    b.variant_options.option1?.toLowerCase() === 'strawberry') {
                    const priceA = a.price.offerPrice ? parseFloat(a.price.offerPrice.value) : 0;
                    const priceB = b.price.offerPrice ? parseFloat(b.price.offerPrice.value) : 0;
                    return priceA - priceB;
                }
                if (a.variant_options.option1?.toLowerCase() === 'strawberry') return -1;
                if (b.variant_options.option1?.toLowerCase() === 'strawberry') return 1;
            }

            if (a.variant_options.option2 && b.variant_options.option2) {
                const priceA = a.price.offerPrice ? parseFloat(a.price.offerPrice.value) : 0;
                const priceB = b.price.offerPrice ? parseFloat(b.price.offerPrice.value) : 0;
                return priceA - priceB;
            }

            // Default price-based sorting for any other cases
            const priceA = a.price.offerPrice ? parseFloat(a.price.offerPrice.value) : 0;
            const priceB = b.price.offerPrice ? parseFloat(b.price.offerPrice.value) : 0;
            return priceA - priceB;
        });
    }, [collections?.variants]);

    useEffect(() => {
        const initializeVariants = () => {
            if (sortedVariants.length === 0) return;

            const urlParams = new URLSearchParams(window.location.search);
            const variantId = urlParams.get("variant");

            // Modified to handle missing inventory
            const firstAvailableVariant = sortedVariants.find(v =>
                v.inventory === undefined || v.inventory > 0
            );

            // If there's a variant ID in the URL, check if it's available
            const requestedVariant = variantId
                ? sortedVariants.find((v) => v.variant_id === variantId)
                : null;

            // Use the requested variant if it's available, otherwise use first available variant
            const defaultVariant = (requestedVariant && (requestedVariant.inventory === undefined || requestedVariant.inventory > 0))
                ? requestedVariant
                : firstAvailableVariant;

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
    }, [sortedVariants]);

    // Early return after hooks
    if (sortedVariants.length === 0) return null;

    const updateURL = (variantId: string | null, handle: string | undefined) => {
        if (variantId && handle) {
            const baseUrl = `/products/${handle}`;
            const newUrl = variantId ? `${baseUrl}?variant=${variantId}` : baseUrl;
            window.history.pushState({}, "", newUrl);
            window.dispatchEvent(
                new CustomEvent("variantChanged", {
                    detail: { variantId },
                })
            );
        }
    };
    const handleOptionSelect = (optionKey: string, optionValue: string) => {
        // Immediately update the selected options
        const newSelections = { ...selectedOptions, [optionKey]: optionValue };
        setSelectedOptions(newSelections);

        const matchingVariant = sortedVariants.find((variant) =>
            Object.entries(newSelections).every(([key, val]) => variant.variant_options[key] === val)
        );

        if (matchingVariant) {
            setCurrentVariant(matchingVariant.variant_id || null);
            setProductHandle(matchingVariant.product_handle || null);
            updateURL(matchingVariant.variant_id, matchingVariant.product_handle);
        }
    };

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

        // Determine the maximum discount variant
        const maxDiscountVariant = sortedVariants.reduce<{ variant: VariantOption | null; discount: number }>((max, variant) => {
            const currentDiscount = parseFloat(variant.price.originalPrice?.value || "0") - parseFloat(variant.price.offerPrice?.value || "0");
            if (!max.variant || currentDiscount > max.discount) {
                return { variant, discount: currentDiscount };
            }
            return max;
        }, { variant: null, discount: 0 });

        const isUniqueMaxDiscount = sortedVariants.filter(variant => {
            const currentDiscount = parseFloat(variant.price.originalPrice?.value || "0") - parseFloat(variant.price.offerPrice?.value || "0");
            return currentDiscount === maxDiscountVariant.discount;
        }).length === 1;

        return Object.entries(optionGroups)
            .sort()
            .map(([optionKey, values], index) => {
                const optionConfig = value.options[optionKey as 'option1' | 'option2' | 'option3'];
                if (!optionConfig?.enabled) return null;

                // Convert Set to Array and apply specific sorting
                let sortedValues = Array.from(values);

                if (optionKey === 'option1' && sortedVariants[0]?.product_handle === 'cureveda-pro-vegan-plant-protein') {
                    // Sort flavors with Strawberry first
                    sortedValues.sort((a, b) => {
                        if (a.toLowerCase() === 'strawberry') return -1;
                        if (b.toLowerCase() === 'strawberry') return 1;
                        return 0;
                    });
                } else if (optionKey === 'option2') {
                    // Sort packs by price
                    sortedValues.sort((a, b) => {
                        const variantA = sortedVariants.find(v => v.variant_options[optionKey] === a);
                        const variantB = sortedVariants.find(v => v.variant_options[optionKey] === b);
                        const priceA = variantA?.price.offerPrice ? parseFloat(variantA.price.offerPrice.value) : 0;
                        const priceB = variantB?.price.offerPrice ? parseFloat(variantB.price.offerPrice.value) : 0;
                        return priceA - priceB;
                    });
                }

                return (
                    <div key={optionKey} className="mb-4">
                        <h3 className="text-sm font-medium mb-2 flex items-center justify-start gap-1">
                            {optionConfig.label} {selectedOptions[optionKey] &&
                                <span className="font-bold">{selectedOptions[optionKey]}</span>
                            }
                        </h3>
                        <div className={`
                            flex justify-start flex-wrap gap-2 
                            ${optionConfig.displayStyle === 'card' ? 'grid grid-cols-3' : 'flex flex-wrap'}
                        `}>
                            {sortedValues.map((optionValue, valueIndex) => {
                                const matchingVariant = sortedVariants.find((v) => {
                                    const optionsToMatch = { ...selectedOptions, [optionKey]: optionValue };
                                    return Object.entries(optionsToMatch).every(
                                        ([key, val]) => v.variant_options[key] === val
                                    );
                                });

                                const Component = optionConfig.displayStyle === 'card' ? Card : Capsule;

                                const isMostLoved = valueIndex === 0;
                                const isGreatDeal = maxDiscountVariant.variant && !isMostLoved && maxDiscountVariant.variant
                                    ? parseFloat(matchingVariant?.price.originalPrice?.value || "0") - parseFloat(matchingVariant?.price.offerPrice?.value || "0") === maxDiscountVariant.discount
                                    : false;

                                return (
                                    <Component
                                        key={optionValue}
                                        label={optionValue}
                                        value={optionValue}
                                        isSelected={selectedOptions[optionKey] === optionValue}
                                        onClick={() => handleOptionSelect(optionKey, optionValue)}
                                        priceDetails={matchingVariant?.price}
                                        inventory={matchingVariant?.inventory !== undefined ? matchingVariant.inventory : null}
                                        greatDeal={isGreatDeal}
                                        mostLoved={isMostLoved}
                                        productHandle={matchingVariant?.product_handle}
                                    />
                                );
                            })}
                        </div>
                    </div>
                );
            });
    };

    return <div style={style} >{renderVariantOptions()}</div>;
};

export default React.memo(VariantsComponent);