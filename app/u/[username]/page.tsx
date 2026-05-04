'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSchema } from '@/schemas/messageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, Send, Sparkles, User, AlertCircle } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const MessagePage = () => {
  const params = useParams<{ username: string }>()
  const username = params.username

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuggestLoading, setIsSuggestLoading] = useState(false)
  const [completion, setCompletion] = useState('')

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      content: ''
    }
  })

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form
  // eslint-disable-next-line react-hooks/incompatible-library
  const messageContent = watch('content')

  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        username,
        content: data.content
      })

      if (response.data.success) {
        toast.success('Message sent! 🎉')
        setValue('content', '')
        setCompletion('')
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      
      if (axiosError.response?.status === 403) {
        toast.error('User is not accepting messages')
      } else if (axiosError.response?.status === 404) {
        toast.error('User not found')
      } else {
        toast.error(axiosError.response?.data.message || 'Failed to send')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGetSuggestions = async () => {
    setIsSuggestLoading(true)
    setCompletion('')
    
    try {
      const response = await fetch('/api/suggest-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) throw new Error('Failed to fetch')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('No reader')

      let accumulatedText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value, { stream: true })
        accumulatedText += chunk
        setCompletion(accumulatedText)
      }
    } catch (error) {
      toast.error('Failed to get suggestions')
    } finally {
      setIsSuggestLoading(false)
    }
  }

  const suggestedMessages = completion
    ? completion.split('||').map(msg => msg.trim()).filter(msg => msg.length > 0)
    : []

  const handleSuggestionClick = (suggestion: string) => {
    setValue('content', suggestion)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="w-full max-w-xl relative z-10">
        <Card className="card-elevated shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-linear-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-heading font-bold text-white">
              Send to <span className="text-gradient">@{username}</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">Your message is anonymous</p>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Message Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <textarea
                  {...register('content')}
                  placeholder="Write your message... (10-300 characters)"
                  className="w-full h-36 p-4 bg-elevated border border-border rounded-lg resize-none input-focus text-white placeholder:text-tertiary"
                  disabled={isSubmitting}
                />
                {errors.content && (
                  <p className="text-sm text-destructive mt-2 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.content.message}
                  </p>
                )}
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span className="text-tertiary">10-300 characters</span>
                  <span className={messageContent?.length > 300 ? 'text-destructive' : messageContent?.length >= 10 ? 'text-success' : 'text-tertiary'}>
                    {messageContent?.length || 0} / 300
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full btn-primary py-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </>
                )}
              </Button>
            </form>

            {/* AI Suggestions */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">Need ideas?</span>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleGetSuggestions}
                  disabled={isSuggestLoading}
                  className="hover:text-gray-300 text-sm"
                >
                  {isSuggestLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Get Suggestions
                    </>
                  )}
                </Button>
              </div>

              {isSuggestLoading && !completion && (
                <div className="text-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                </div>
              )}

              {suggestedMessages.length > 0 && (
                <div className="space-y-3">
                  {suggestedMessages.map((suggestion, index) => (
                    <div
                      key={index}
                      className="card-elevated cursor-pointer hover-lift p-4 rounded-lg"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <p className="text-sm text-muted-foreground">{suggestion}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <p className="text-center text-sm text-tertiary mt-4 flex items-center justify-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Your identity remains completely anonymous
        </p>
      </div>
    </div>
  )
}

export default MessagePage
