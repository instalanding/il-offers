import { NextResponse } from "next/server";
import { pool } from "@/lib/postgres";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { phone_number, is_verified } = body;

    // Step 1: Check if the user already exists
    const userQuery = `
          SELECT * FROM checkout_users WHERE phone_number = $1;
        `;
    const userResult = await pool.query(userQuery, [phone_number]);

    if (userResult.rows.length > 0) {
      // User already exists, fetch associated addresses
      const addressQuery = `
              SELECT * FROM addresses WHERE user_id = $1;
            `;
      const addressResult = await pool.query(addressQuery, [userResult.rows[0].id]);

      return NextResponse.json({
        success: true,
        message: "User already exists. Here are the associated addresses.",
        data: {
          user: userResult.rows[0],
          addresses: addressResult.rows,
        },
      });
    }

    // Step 2: Create a new user if phone_number does not exist
    const insertQuery = `
          INSERT INTO checkout_users (
            phone_number,
            is_verified
          )
          VALUES ($1, $2)
          RETURNING *;
        `;
    const insertValues = [phone_number, is_verified];
    const newUserResult = await pool.query(insertQuery, insertValues);

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      data: newUserResult.rows[0],
    });
  } catch (error: any) {
    console.error("Error creating checkout user:", error);
    return NextResponse.json({
      success: false,
      message: "Error creating checkout user",
      error: error.message,
    }, { status: 500 });
  }
};


export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const phone_number = searchParams.get("phone_number");

    if (!phone_number) {
      return NextResponse.json({
        success: false,
        message: "phone number is required",
      }, { status: 400 })
    }

    const query = `
    select * from checkout_users
    WHERE phone_number = $1;`;
    const result = await pool.query(query, [phone_number]);

    if (!result.rows[0]) {
      return NextResponse.json({
        success: false,
        message: "No user found for this phone number"
      }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error: any) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json({
      success: false,
      message: "Error fetching addresses",
      error: error.message,
    }, { status: 500 });
  }
}