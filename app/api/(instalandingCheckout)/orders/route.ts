import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { pool } from "@/lib/postgres";

export const POST = async (req: Request) => {
  try {
    const body = await req.json(); // Parse the request body
    const {
      address1,
      address2,
      city,
      country,
      country_code,
      country_name,
      company,
      customer_id,
      first_name,
      id,
      last_name,
      name,
      phone,
      province,
      province_code,
      zip
    } = body;

    // Insert the data into PostgreSQL
    const query = `
      INSERT INTO orders (
        id,
        address1,
        address2,
        city,
        country,
        country_code,
        country_name,
        company,
        customer_id,
        first_name,
        last_name,
        name,
        phone,
        province,
        province_code,
        zip
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *;
    `;

    const values = [
      id,            // Order ID
      address1,      // Address line 1
      address2,      // Address line 2
      city,          // City
      country,       // Country
      country_code,  // Country code
      country_name,  // Country name
      company,       // Company name
      customer_id?.id, // Customer ID
      first_name,    // First name
      last_name,     // Last name
      name,          // Full name
      phone,         // Phone number
      province,      // Province
      province_code, // Province code
      zip            // Zip code
    ];

    const result = await pool.query(query, values);

    // Respond with the newly created order
    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json({
      success: false,
      message: "Error creating order",
      error: error.message
    }, { status: 500 });
  }
};
