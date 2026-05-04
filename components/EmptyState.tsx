import React from 'react'
import { Button } from './ui/button'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) => {
  return (
    <div className="card-elevated rounded-lg p-12 text-center animate-fade-in">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <Icon className="h-10 w-10 text-primary" />
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-400 mb-6">
          {description}
        </p>
        
        {/* Action Button */}
        {actionLabel && onAction && (
          <Button 
            onClick={onAction}
            className="btn-primary"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  )
}

export default EmptyState
