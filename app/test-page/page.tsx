import { Metadata } from "next";
import dynamic from 'next/dynamic';

// Simple loading fallback
function LoadingFallback() {
  return <div>Loading...</div>;
}

// Use the simpler client component
const SimpleClient = dynamic(() => import('@/components/SimpleClientComponent'), {
  ssr: false,
  loading: LoadingFallback
});

// Simple metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Test Page",
    description: "Simple test page"
  };
}

// Test page component
export default function TestPage() {
  return (
    <div>
      <h1>Test Page</h1>
      <p>This is a test page to debug the server component error.</p>
      <SimpleClient />
    </div>
  );
} 