import { NextResponse } from "next/server";
import { pool } from "@/lib/postgres";

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        const {
            pincode,
            first_name,
            last_name,
            city,
            address1,
            address2,
            state,
            email,
            user_id
        } = body;
        const query = `
        INSERT INTO addresses (
          pincode,
          first_name,
          last_name,
          city,
          address1,
          address2,
          state,
          email,
          user_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
      `;
        const values = [
            pincode,
            first_name,
            last_name,
            city,
            address1,
            address2,
            state,
            email,
            user_id
        ]
        const result = await pool.query(query, values);
        return NextResponse.json({
            success: true,
            message: "Address created successfully",
            data: result.rows[0],
        });
    } catch (error: any) {
        console.error("Error creating address:", error);
        return NextResponse.json({
            success: false,
            message: "Error creating address",
            error: error.message
        }, { status: 500 });
    }
}

export const GET = async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url);
        const user_id = searchParams.get("user_id");
        const address_id = searchParams.get("id"); // Get the specific address ID if provided

        // Check if user_id is provided
        if (!user_id) {
            return NextResponse.json({
                success: false,
                message: "User Id is required",
            }, { status: 400 });
        }

        let query;
        let values;

        // If address_id is provided, fetch that specific address, else fetch all addresses for the user
        if (address_id) {
            query = `
                SELECT * FROM addresses
                WHERE user_id = $1 AND id = $2;
            `;
            values = [user_id, address_id];
        } else {
            query = `
                SELECT * FROM addresses
                WHERE user_id = $1;
            `;
            values = [user_id];
        }

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return NextResponse.json({
                success: false,
                message: address_id ? "Address not found" : "No addresses found for this user",
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: result.rows,
        });
    } catch (error: any) {
        console.error("Error fetching addresses:", error);
        return NextResponse.json({
            success: false,
            message: "Error fetching addresses",
            error: error.message,
        }, { status: 500 });
    }
};
