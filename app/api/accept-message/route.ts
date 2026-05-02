import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User | undefined = session?.user as User;

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }

  const userId = user?._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessages: acceptMessages}, { new: true });

    if(!updatedUser){
        return NextResponse.json({
            success: false,
            message: "User not found"
        }, {status: 401})

    }
    return NextResponse.json(
      {
        success: true,
        message: "Message acceptance status updated successfully.",
        user: updatedUser,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to update user status to accept messages:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          "An error occurred while updating your message acceptance status. Please try again later.",
      },
      { status: 500 },
    );
  }
}

export async function GET(){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User | undefined = session?.user as User;

    if(!session || !session.user){
        return NextResponse.json({
            success: false,
            message: "Unauthorized"
        }, {status: 401})
    }

    const userId = user?._id;

    try {
        const user = await UserModel.findById(userId);

        if(!user){
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, {status: 404})
        }

        return NextResponse.json({
            success: true,
            isAcceptingMessages: user.isAcceptingMessages
        }, {status: 200})

    } catch (error) {
        console.error("Failed to fetch user:", error);
        return NextResponse.json({
            success: false,
            message: "An error occurred while fetching user data."
        }, {status: 500})
    }
}
