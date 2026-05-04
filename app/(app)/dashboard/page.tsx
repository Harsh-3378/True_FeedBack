'use client'
import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Message } from '@/model/User';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw, Copy, Check, Link2, MessageSquare, TrendingUp } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { DashboardSkeleton } from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';

const Dashboard = () => {

    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const [copied, setCopied] = useState(false)

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => String(message._id) !== messageId))
    } 

    const {data: session} = useSession();

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
        mode: 'onChange'
    })

    const {register, watch, setValue} = form

    // eslint-disable-next-line react-hooks/incompatible-library
    const acceptMessages = watch('acceptMessages')

    const fetchAcceptMessage = useCallback(async ()=> {
        setIsSwitchLoading(true)
        try {
          const response = await axios.get<ApiResponse>(`/api/accept-message`)
          setValue('acceptMessages', response.data.isAcceptingMessages ?? false)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message || "Failed to fetch settings")
        } finally {
            setIsSwitchLoading(false)
            setIsInitialLoading(false)
        }
    }, [setValue])

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true);

        try {
           const response = await axios.get<ApiResponse>('/api/get-messages')
           setMessages(response.data.messages || [])
           if(refresh){
             toast.success("Messages refreshed!")
           }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message || "Failed to fetch messages");
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        if(!session || !session.user) return
        
        const fetchData = async () => {
            await fetchAcceptMessage()
            await fetchMessages()
        }
        
        fetchData()
    }, [session, fetchAcceptMessage, fetchMessages])

    const handleSwitchChange = async () => {
        const newValue = !acceptMessages
        setIsSwitchLoading(true)
        
        try {
           const response = await axios.post<ApiResponse>('/api/accept-message', {
                acceptMessages: newValue
            })
            
            setValue('acceptMessages', newValue)
            toast.success(response.data.message)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message || "Failed to update");
            setValue('acceptMessages', acceptMessages)
        } finally {
            setIsSwitchLoading(false)
        }
    }

    if(!session || !session.user){
        return (
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )
    }

    const {username} = session.user as User
    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/u/${username}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        setCopied(true)
        toast.success("Link copied!")
        setTimeout(() => setCopied(false), 2000)
    }

    // Get current hour for greeting
    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good morning'
        if (hour < 18) return 'Good afternoon'
        return 'Good evening'
    }

  return (
    <div className="min-h-screen grain bg-[#0A0A0F]">
      <Navbar />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {isInitialLoading ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* Welcome Header */}
            <div className="mb-8 animate-fade-in">
              <h1 className="text-3xl font-bold text-white mb-1">
                {getGreeting()}, {username}
              </h1>
              <p className="text-gray-400">Manage your anonymous messages</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-fade-in">
              <div className="card-elevated rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {messages.length}
                    </p>
                    <p className="text-xs text-gray-400">Total Messages</p>
                  </div>
                </div>
              </div>

              <div className="card-elevated rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {
                        messages.filter((m) => {
                          const dayAgo = new Date(
                            Date.now() - 24 * 60 * 60 * 1000,
                          );
                          return new Date(m.createdAt) > dayAgo;
                        }).length
                      }
                    </p>
                    <p className="text-xs text-gray-400">Last 24h</p>
                  </div>
                </div>
              </div>

              <div className="col-span-2 card-elevated rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Link2 className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        Share Link
                      </p>
                      <p className="text-xs text-gray-400">
                        Get anonymous feedback
                      </p>
                      <p className="text-xs text-gray-400">{profileUrl}</p>
                    </div>
                  </div>
                  <Button
                    onClick={copyToClipboard}
                    size="sm"
                    className="btn-primary"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Settings Card */}
            <div className="card-elevated rounded-lg p-5 mb-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-white mb-1">
                    Message Settings
                  </h3>
                  <p className="text-sm text-gray-400">
                    {isInitialLoading
                      ? "Loading..."
                      : acceptMessages
                        ? "Currently accepting messages"
                        : "Not accepting messages"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    {...register("acceptMessages")}
                    checked={acceptMessages ?? false}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading || isInitialLoading}
                    className="data-[state=checked]:bg-primary"
                  />
                  <span className="text-sm font-medium text-gray-300 min-w-12">
                    {acceptMessages ? "On" : "Off"}
                  </span>
                </div>
              </div>
            </div>

            {/* Messages Section */}
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Your Messages
                  </h2>
                  <p className="text-sm text-gray-400">
                    {messages.length} total
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                  }}
                  disabled={isLoading}
                  className="border-[#2A2A35] hover:bg-white/5 hover:border-primary/50"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCcw className="h-4 w-4" />
                  )}
                  <span className="ml-2 hidden sm:inline">Refresh</span>
                </Button>
              </div>

              {/* Messages Grid */}
              {messages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {messages.map((message) => (
                    <MessageCard
                      key={String(message._id)}
                      message={message}
                      onMessageDelete={handleDeleteMessage}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={MessageSquare}
                  title="No messages yet"
                  description="Share your link to start receiving anonymous messages from others"
                  actionLabel="Copy Your Link"
                  onAction={copyToClipboard}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard
