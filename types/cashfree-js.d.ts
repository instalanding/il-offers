declare module '@cashfreepayments/cashfree-js' {
    interface Cashfree {
      PGCreateOrder(date: string, request: any): Promise<any>;
    }
  
    export function load(options: { mode: string; appId?: string; clientSecret?: string }): Promise<Cashfree>;
  }
  