// Define the type for component data
export interface ComponentData {
    id: string;
    label: string;
    type: string;
    value?: string | { id: number; title: string; content: string; }[] | { id: number; ctaType: string; price: number; link: string; logo: string; style: { backgroundColor: string; border: string; }; subtitle?: string; color?: string; }[];
    style?: React.CSSProperties;
    images?: string[];
    price?: number;
    discount?: number;
    variantType?: string;
    htmlTag?: string;
}

// Mock data for configuration
export const config = {
    headerText: "10% OFF on your order. Use Coupon : SV10",
    footerText: "🛒 Get this in 2-3 days at your doorstep",
    buttonText: "Buy Now",
    primaryColor: "#e2c9f7",
    secondaryColor: "black",
    fontFamily: "Arial",
};

// Mock data for components
export const componentsData: ComponentData[] = [
    {
        id: "cd14d4f4-00b0-48f3-9d3c-7d64f5ef341f",
        label: "Carousel",
        type: "carousel",
        images: []
    },
    {
        id: "7acc697f-5684-4742-b3be-cc8053f36ab9",
        label: "Text",
        type: "text",
        htmlTag: "h1",
        value: "Add your text here",
        style: {
            padding: "0px",
            margin: "0px",
            fontStyle: "normal",
            fontSize: 18,
            color: "#000",
            textAlign: "left"
        }
    },
    {
        id: "8ac6abed-79b9-4bff-9709-50864d17b6db",
        label: "HTML",
        type: "html",
        value: "<p>Your html text here</p>",
        style: {
            padding: "0px",
            margin: "0px",
            fontSize: 16,
            color: "#000",
            textAlign: "left"
        }
    },
    {
        id: "f15c7542-f2ab-43c0-9c22-925d46ade14b",
        label: "Ratings",
        type: "ratings",
        price: 999,
        discount: 30
    },
    {
        id: "28295a6c-6958-43b9-8ec7-99a835183ef9",
        label: "Accordion",
        type: "accordion",
        style: {
            fontWeight: 400
        },
        value: [
            {
                id: 1,
                title: "Product Features",
                content: "Diverse | Luminous | Playful Transport yourself to a tropical paradise with the Coral Glaze Collection."
            },
            {
                id: 2,
                title: "Description",
                content: "Diverse | Luminous | Playful Transport yourself to a tropical paradise with the Coral Glaze Collection."
            },
            {
                id: 3,
                title: "Fabric",
                content: "Diverse | Luminous | Playful Transport yourself to a tropical paradise with the Coral Glaze Collection."
            }
        ]
    },
    {
        id: "3697e87d-11e7-4cb2-bb92-341a9cc39af3",
        label: "Variants",
        type: "variants",
        variantType: "size"
    },
    {
        id: "efb4c8cb-b47c-4ca7-af72-5453327fc178",
        label: "Multi CTA",
        type: "muliple-cta",
        style: {
            fontFamily: "Ubuntu",
            fontWeight: 400
        },
        value: [
            {
                id: 1,
                ctaType: "amazon",
                price: 730,
                link: "",
                logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
                style: {
                    backgroundColor: "rgba(255, 153, 0, 0.06)",
                    border: "1px solid #FFF2DE"
                },
                subtitle: "Fast delivery with Amazon Prime",
                color: "#FF9900"
            },
            {
                id: 2,
                ctaType: "flipkart",
                price: 730,
                link: "",
                logo: "https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png",
                style: {
                    backgroundColor: "rgba(217, 238, 255, 1)",
                    border: "1px solid #C3E2FC"
                },
                subtitle: "Exclusive offers on Flipkart",
                color: "#2874F0"
            }
        ]
    }
];
