import React from 'react'

export const MessageCardSkeleton = () => {
  return (
    <div className="card-elevated rounded-lg p-4 animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className="skeleton h-3 w-16"></div>
        <div className="skeleton h-7 w-7 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-5/6"></div>
        <div className="skeleton h-4 w-4/6"></div>
      </div>
    </div>
  )
}

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="skeleton h-8 w-48"></div>
        <div className="skeleton h-4 w-64"></div>
      </div>
      
      {/* Settings Cards Skeleton */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card-elevated rounded-lg p-4">
          <div className="skeleton h-4 w-24 mb-3"></div>
          <div className="skeleton h-10 w-full"></div>
        </div>
        <div className="card-elevated rounded-lg p-4">
          <div className="skeleton h-4 w-32 mb-3"></div>
          <div className="skeleton h-10 w-full"></div>
        </div>
      </div>
      
      {/* Messages Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="skeleton h-6 w-32"></div>
          <div className="skeleton h-8 w-20"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <MessageCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

export const FormSkeleton = () => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="space-y-2">
        <div className="skeleton h-4 w-24"></div>
        <div className="skeleton h-10 w-full rounded-lg"></div>
      </div>
      <div className="space-y-2">
        <div className="skeleton h-4 w-24"></div>
        <div className="skeleton h-10 w-full rounded-lg"></div>
      </div>
      <div className="skeleton h-12 w-full rounded-lg"></div>
    </div>
  )
}

export default MessageCardSkeleton
