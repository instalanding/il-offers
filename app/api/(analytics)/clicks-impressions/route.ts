import { NextResponse, userAgent } from "next/server";
import { fetchApi, parseIp } from "@/lib/backendFunctions";
import { pool } from "@/lib/postgres";


export const POST = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const offerId = searchParams.get("offer_id");
    const ipFromShopify = searchParams.get("user_ip");
    const visitorId = searchParams.get("visitor_id");
    const advertiser_id = searchParams.get("advertiser_id");
    const productUrl = searchParams.get("product_url");
    const tagsParam = searchParams.get("tags");
    const useragent = userAgent(req);
    const userIP = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];
    console.log(userIP, "userIP")

    if (!offerId) {
        return NextResponse.json({ error: 'offer_id query parameter is required' }, { status: 400 });
    }

    console.log(tagsParam,
        "tagsParam"
    )
    const tagsArray = tagsParam ? tagsParam.split(',').map(tag => tag.trim()) : [];
    const formattedTags = [...tagsArray, null, null, null, null, null].slice(0, 5);

    console.log(formattedTags, "formattedTags")

    try {
        const apiData = await fetchApi(userIP);
        const query = `
        INSERT INTO Clicks (
            visitor_id, product_url, userIP, useragent, offerId, advertiser_id,
            user_data_ip_address, user_data_city, user_data_city_geoname_id,
            user_data_region, user_data_region_geoname_id, user_data_postal_code,
            user_data_country, user_data_country_code, user_data_country_geoname_id,
            user_data_country_is_eu, user_data_continent, user_data_continent_code,
            user_data_continent_geoname_id, user_data_longitude, user_data_latitude,
            user_data_security, user_data_timezone, tag1, tag2, tag3, tag4, tag5, created_at
        ) VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15,
            $16, $17, $18, $19, $20,
            $21, $22, $23, $24, $25, $26, $27, $28,  NOW()
        ) RETURNING *;
    `;

        const values = [
            visitorId, productUrl, apiData.ip_address, JSON.stringify(useragent), offerId, advertiser_id,
            apiData.ip_address, apiData.city, apiData.city_geoname_id,
            apiData.region, apiData.region_geoname_id, apiData.postal_code,
            apiData.country, apiData.country_code, apiData.country_geoname_id,
            apiData.country_is_eu, apiData.continent, apiData.continent_code,
            apiData.continent_geoname_id, apiData.longitude, apiData.latitude,
            JSON.stringify(apiData.security), apiData.timezone,
            ...formattedTags
        ];

        const result = await pool.query(query, values);
        return NextResponse.json({ message: 'Click recorded successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error in recording clicks:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const offerId = searchParams.get("offer_id");
    const advertiser_id = searchParams.get("advertiser_id");
    const ipFromShopify = searchParams.get("user_ip");
    const productUrl = searchParams.get("product_url");
    const visitorId = searchParams.get("visitor_id");
    const userIP = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0]
    const useragent = userAgent(req);
    const tagsParam = searchParams.get("tags");
    const utm_source = searchParams.get("utm_source");
    const utm_medium = searchParams.get("utm_medium");
    const utm_campaign = searchParams.get("utm_campaign");
    const tagsArray = tagsParam ? tagsParam.split(',').map(tag => tag.trim()) : [];
    const formattedTags = [...tagsArray, null, null, null, null, null].slice(0, 5);

    console.table([utm_source, utm_medium, utm_campaign])


    if (!offerId) {
        return NextResponse.json({ error: 'offer_id query parameter is required' }, { status: 400 });
    }

    try {
        const apiData = ipFromShopify && ipFromShopify !== "" ? await fetchApi(ipFromShopify) : await fetchApi(userIP)
        const query = `
        INSERT INTO impressions (
        utm_source, utm_medium, utm_campaign, visitor_id, product_url, userIP, 
        useragent, offerId, advertiser_id, user_data_ip_address, user_data_city, 
        user_data_city_geoname_id, user_data_region, user_data_region_geoname_id, user_data_postal_code,
            user_data_country, user_data_country_code, user_data_country_geoname_id,
            user_data_country_is_eu, user_data_continent, user_data_continent_code,
            user_data_continent_geoname_id, user_data_longitude, user_data_latitude,
            user_data_security, user_data_timezone, tag1, tag2, tag3, tag4, tag5, created_at
        ) VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15,
            $16, $17, $18, $19, $20,
            $21, $22, $23, $24, $25, $26, 
            $27, $28, $29, $30, $31, NOW()
        ) RETURNING *;
    `;
        const values = [
            utm_source,
            utm_medium,
            utm_campaign,
            visitorId,
            productUrl,
            userIP,
            JSON.stringify(useragent),
            offerId,
            advertiser_id,
            apiData.ip_address,
            apiData.city,
            apiData.city_geoname_id,
            apiData.region,
            apiData.region_geoname_id,
            apiData.postal_code,
            apiData.country,
            apiData.country_code,
            apiData.country_geoname_id,
            apiData.country_is_eu,
            apiData.continent,
            apiData.continent_code,
            apiData.continent_geoname_id,
            apiData.longitude,
            apiData.latitude,
            JSON.stringify(apiData.security),
            apiData.timezone,
            ...formattedTags
        ];

        const result = await pool.query(query, values);
        return NextResponse.json({ message: 'Impressions recorded successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error updating views:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
};