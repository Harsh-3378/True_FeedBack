import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    await dbConnect();

    const {username, content} = await request.json();

    try {
        const user = await UserModel.findOne({username});

        if(!user){
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, {status: 404})
        }

        if(!user.isAcceptingMessages){
            return NextResponse.json({
                success: false,
                message: "User is not accepting messages"
            }, {status: 403})
        }

        const newMessage: Message = {
            content,
            createdAt: new Date()
        } as Message;

        user.messages.push(newMessage)
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Message sent successfully"
        }, {status: 200})

    } catch (error) {
        console.error("Failed to send message:", error);
        return NextResponse.json({
            success: false,
            message: "An error occurred while sending the message."
        }, {status: 500})
    }
}