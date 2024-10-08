import Accordions from "@/components/OfferComponents/Accordions"

export default function Home({ searchParams }: any) {
  const appId = searchParams.instalanding_app_id;


  if (!appId) {
    return <h1 className="font-semibold text-red-600">Instalanding app Id missing!</h1>
  }

  return (
    <div className="bg-red-200 max-w-[388px] p-[20px] rounded-3xl">
      <Accordions appId={appId} />
    </div>
  );
}

