// Global type augmentation
declare global {
    interface Window {
      ILTracker?: {
        trackOrder: (orderData: {
          orderId: string;
          amount: number;
          [key: string]: any;
        }) => void;
      };
    }
  }
  
  export {};  