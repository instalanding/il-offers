export function calculateDiscount(originalPrice: number, offerPrice: number): number {
    let percentageOff = ((originalPrice - offerPrice) / originalPrice) * 100;
    return Math.round(percentageOff);
}

export const formatPrice = (value: number, prefix: string): string => {
    return `${prefix}${new Intl.NumberFormat('en-IN').format(value)}`;
};