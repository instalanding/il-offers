import { fetchApi } from "@/lib/backendFunctions";
import { pool } from "@/lib/postgres";
import { NextResponse, userAgent } from "next/server";
import { QueryResult } from "pg";

export const POST = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const offerId = searchParams.get("offer_id");
    const ipFromShopify = searchParams.get("user_ip") ?? '';
    const userIP = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];
    console.log(userIP, "userIP");
    const useragent = userAgent(req);
    const tagsParam = searchParams.get("tags");
    const tagsArray = tagsParam ? tagsParam.split(',').map(tag => tag.trim()) : [];
    const formattedTags = [...tagsArray, null, null, null, null, null].slice(0, 5);
    const data = await req.json();

    if (!offerId) {
        return NextResponse.json({ error: 'offer_id query parameter is required' }, { status: 400 });
    }


    try { 
        const apiData = ipFromShopify && ipFromShopify !== "" ? await fetchApi(ipFromShopify) : await fetchApi(userIP);

        // Check for existing record
        const checkQuery = `
            SELECT * FROM saveoffer
            WHERE phone = $1 AND offerId = $2;
        `;
        const checkValues = [data.phone, offerId];
        const checkResult: QueryResult<any> = await pool.query(checkQuery, checkValues);

        if (checkResult.rowCount && checkResult.rowCount > 0) {
            return NextResponse.json({ error: 'Duplicate phone number for the given offer_id' }, { status: 409 });
        }
        

        // Insert new record
        const query = `
        INSERT INTO saveoffer (
            name,
            phone,
            product_url, userIP, useragent, offerId, advertiser_id,
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
            $21, $22, $23, $24, $25, $26, $27, $28, $29, NOW()
        ) RETURNING *;
    `;

        const values = [
            data.name, data.phone, data.product_url, userIP, JSON.stringify(useragent), offerId, data.advertiser_id,
            apiData.ip_address, apiData.city, apiData.city_geoname_id,
            apiData.region, apiData.region_geoname_id, apiData.postal_code,
            apiData.country, apiData.country_code, apiData.country_geoname_id,
            apiData.country_is_eu, apiData.continent, apiData.continent_code,
            apiData.continent_geoname_id, apiData.longitude, apiData.latitude,
            JSON.stringify(apiData.security), apiData.timezone,
            ...formattedTags  // Spread the formattedTags array into individual columns
        ];

        const result = await pool.query(query, values);
        return NextResponse.json({ message: 'Offer saved successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error in saving the offer', error);
        return NextResponse.json({ error: 'Internal Server Error save offer' }, { status: 500 });
    }
};
