import { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { userAgent } from "next/server";


const getDeepLink = async (dp_id: string) => {
    const response = await fetch(`${process.env.API_URL}deepLink/${dp_id}`);
    if (!response.ok) {
        throw new Error("Deep link not found");
    }
    console.log(response.json)
    return response.json();
};

const DeepLinkRedirect = async ({ params }: { params: { dp_id: string } }) => {

    const { dp_id } = params;

    const data = await getDeepLink(dp_id);
    let redirectUrl = data;
    let href = data;
    if (/android/i.test(userAgent.toString())) {
        redirectUrl = `intent:${href.replace(/^https?:\/\//, '')}#Intent;package=com.android.chrome;scheme=https;action=android.intent.action.VIEW;end;`;
    } else if (/iPad|iPhone|iPod/.test(userAgent.toString()) && !/windows/i.test(userAgent.toString())) {
        redirectUrl = href.startsWith('http') ? href : `https://${href}`;
    }
    permanentRedirect(redirectUrl);

};

export default DeepLinkRedirect;