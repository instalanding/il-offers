export function calculateDiscount(price:number, discountPercent: number) {
    if (typeof price !== 'number' || typeof discountPercent !== 'number') {
      throw new Error('Both arguments must be numbers.');
    }
  
    const discountValue = (price * discountPercent) / 100;
    const discountPrice = price - discountValue;

    return {
      discountPrice: discountPrice,
      discountValue: discountValue
    };
  }