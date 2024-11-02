import { Lock } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

export default function PremiumContentLock({
  size = 'default',
  showText = true,
  className = '',
  text = '',
}: {
  size?: 'small' | 'default' | 'large'
  showText?: boolean
  className?: string
text?: string
}) {
  const sizeClasses = {
    small: 'text-[8px] p-0.5',
    default: 'text-xs p-1',
    large: 'text-sm p-1.5'
  }

  const iconSizes = {
    small: 8,
    default: 12,
    large: 16
  }

  return (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger>
                <div className={`bg-yellow-200/20 w-full px-3 py-1.5 h-full rounded-sm flex items-center gap-1.5 rounded-bl ${sizeClasses[size]} ${className}`}>
                    <Lock size={iconSizes[size]} className="text-yellow-500" />
                    <span 
                    className={`${showText ? "block" : "hidden hover:block"} font-semibold`}>
                        {text}
                    </span>
                </div>
            </TooltipTrigger>
            <TooltipContent side="top" align="center" className="bg-yellow-200/20 " sideOffset={0}>
                <div className="">
                    <p className="text-sm dark:text-yellow-200 text-yellow-800/60 items-center justify-center flex flex-row gap-0.5">
                    <Lock size={iconSizes[size]} className="dark:text-yellow-200 text-yellow-800/60" />
                    This content is only available to premium users.
                    </p>
                </div>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  )
}