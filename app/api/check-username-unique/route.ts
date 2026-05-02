import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = { username: searchParams.get("username") };

    const result = UsernameQuerySchema.safeParse(queryParam);
    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message:
            usernameError.length > 0 ? usernameError.join(", ") : "Invalid username",
        },
        { status: 400 },
      );
    }

    const {username} = result.data;

    const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true})

    if (existingVerifiedUser) {
      return NextResponse.json({
        success: false,
        message: "Username is already taken",
      }, {status: 400})
    }

    return NextResponse.json({
      success: true,
      message: "Username is available",
    });
  } catch (error) {
    console.error("Error checking username uniqueness:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while checking username uniqueness",
      },
      { status: 500 },
    );
  }
}
