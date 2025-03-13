"use server"
import { revalidatePath } from "next/cache";

const page = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { generate?: string };
}) => {
  // Check if we need to revalidate based on search params

  console.log(`Revalidating path: /test/${params.slug}`);
  revalidatePath(`/test/${params.slug}`);

  

  return <div>done</div>;
};

export default page;

