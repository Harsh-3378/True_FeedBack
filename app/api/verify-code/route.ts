import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    const user = await UserModel.findOne({ username });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpires) > new Date();

    if (!isCodeValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid verification code",
        },
        { status: 400 },
      );
    }

    if (!isCodeNotExpired) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification code has expired",
        },
        { status: 400 },
      );
    }

    user.isVerified = true;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Error verifying code:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while verifying the code",
      },
      { status: 500 },
    );
  }
}
