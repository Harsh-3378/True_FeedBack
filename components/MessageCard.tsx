"use client"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Trash2, Clock } from "lucide-react";
import { Message } from "@/model/User";
import { toast } from "sonner";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
}

const MessageCard = ({message, onMessageDelete}: MessageCardProps) => {

    const handleDeleteConfirm = async () => {
        try {
            const messageId = String(message._id)
            await axios.delete<ApiResponse>(`/api/delete-message/${messageId}`)
            toast.success("Message deleted")
            onMessageDelete(messageId)
        } catch (error) {
            toast.error("Failed to delete")
            console.error("Error deleting message:", error)
        }
    }

    const formatDate = (date: Date) => {
        const now = new Date()
        const messageDate = new Date(date)
        const diffInMs = now.getTime() - messageDate.getTime()
        const diffInMins = Math.floor(diffInMs / 60000)
        const diffInHours = Math.floor(diffInMs / 3600000)
        const diffInDays = Math.floor(diffInMs / 86400000)

        if (diffInMins < 1) return 'Just now'
        if (diffInMins < 60) return `${diffInMins}m ago`
        if (diffInHours < 24) return `${diffInHours}h ago`
        if (diffInDays < 7) return `${diffInDays}d ago`
        
        return messageDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric'
        })
    }

  return (
    <Card className="card-elevated hover-lift group animate-fade-in">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
            <Clock className="h-3 w-3" />
            {formatDate(message.createdAt)}
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-7 w-7 text-gray-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#1A1A24] border-[#2A2A35]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Delete Message?</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  This action cannot be undone. This message will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-[#252530] border-[#2A2A35] hover:bg-[#2A2A35] text-white">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteConfirm}
                  className="bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <p className="text-sm leading-relaxed text-gray-200">
          {message.content}
        </p>
      </CardContent>
    </Card>
  );
}

export default MessageCard
