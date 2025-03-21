import { revalidatePath } from "next/cache";

export const runtime = "edge";

// Only apply "use server" to the specific functions that need it
async function revalidateSlug(slug: string) {
  "use server";
  console.log(`Revalidating path: /products/${slug}`);
  revalidatePath(`/products/${slug}`);
}

const page = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { generate?: string };
}) => {
  // Check if we need to revalidate based on search params
  await revalidateSlug(params.slug);

  return <div>done</div>;
};

export default page;

