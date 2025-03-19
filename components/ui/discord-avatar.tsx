"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type StatusType = "online" | "idle" | "dnd" | "offline" | "streaming" | "invisible" | null
/**
 * Props for Discord Avatr component
 */
interface DiscordAvatarProps {
  src?: string
  fallback?: string
  alt?: string
  size?: "sm" | "md" | "lg" | "xl"
  status?: StatusType
  showStatusOnHover?: boolean
  className?: string
}

function DiscordAvatar({
  src = "/placeholder.svg?height=80&width=80",
  fallback = "U",
  alt = "User avatar",
  size = "md",
  status = null,    //can be set
  showStatusOnHover = true,
  className,
}: DiscordAvatarProps) {
  const [isHovered, setIsHovered] = useState(false)

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  }

  const statusColors = {
    online: "bg-green-500",
    idle: "bg-yellow-400",
    dnd: "bg-red-500",
    streaming: "bg-purple-500",
    offline: "bg-gray-500",
    invisible: "bg-gray-500 opacity-50",
  }

  const statusSizes = {
    sm: "h-2.5 w-2.5 right-0 bottom-0",
    md: "h-3 w-3 right-0 bottom-0",
    lg: "h-3.5 w-3.5 right-0 bottom-0",
    xl: "h-4 w-4 right-0.5 bottom-0.5",
  }

  const getStatusText = (status: StatusType) => {
    switch (status) {
      case "online":
        return "Online"
      case "idle":
        return "Idle"
      case "dnd":
        return "Do Not Disturb"
      case "streaming":
        return "Streaming"
      case "offline":
        return "Offline"
      case "invisible":
        return "Invisible"
      default:
        return ""
    }
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
        {/**This is the circle of the Avatar */}
      <Avatar className={cn(sizeClasses[size], className)}>
        <AvatarImage src={src} alt={alt} />
        <AvatarFallback className="bg-muted text-muted-foreground">{fallback}</AvatarFallback>
      </Avatar>

      {status && (
        <span
          className={cn("absolute rounded-full border-2 border-background", statusColors[status], statusSizes[size])}
        />
      )}

      {showStatusOnHover && isHovered && status && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
          {getStatusText(status)}
        </div>
      )}
    </div>
  )
}

export { DiscordAvatar }