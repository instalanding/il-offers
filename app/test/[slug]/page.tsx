import { revalidatePath } from "next/cache";

const page = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { generate?: string };
}) => {
  // Check if we need to revalidate based on search params

  // if (searchParams.generate === "true") {
  //   console.log(`Revalidating path: /test/${params.slug}`);
  //   revalidatePath(`/test/${params.slug}`);
  // }
  
  const response = await fetch(
    `${process.env.API_URL_V2}/campaign?slug=${params.slug}`,
    { 
      next: { 
        revalidate: searchParams.generate === "true" ? 0 : 60 * 60 * 24 
      } 
    } // Conditional revalidation based on generate parameter
  );
  const data = await response.json();
  console.log(data);

  const string = JSON.stringify(data);

  return (

      <div>{string}</div>
  );
};

export default page;

// Generate static params for specific slug
export async function generateStaticParams() {
  return [
    {
      slug: "saptamveda-spirulina-capsules-2000-mg-per-serving",
    },
  ];
}

// Force static generation
export const dynamic = "force-static";
