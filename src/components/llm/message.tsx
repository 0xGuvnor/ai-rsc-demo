import { cn } from "@/lib/utils";
import { Sparkle, SparkleIcon, UserIcon } from "lucide-react";
import { ReactNode } from "react";

interface UserMessageProps {
  children: ReactNode;
}

export function UserMessage({ children }: UserMessageProps) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm bg-background">
        <UserIcon />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        {children}
      </div>
    </div>
  );
}

interface BotMessageProps {
  children: ReactNode;
  className?: string;
}

export function BotMessage({ children, className }: BotMessageProps) {
  return (
    <div className={cn("group relative flex items-start md:-ml-12", className)}>
      <div className="flex size-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm bg-background">
        <SparkleIcon />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        {children}
      </div>
    </div>
  );
}

interface BotCardProps {
  children: ReactNode;
  showAvatar?: boolean;
  loading?: boolean;
}

export function BotCard({
  children,
  showAvatar = true,
  loading = false,
}: BotCardProps) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div
        className={cn(
          "flex size-8 select-none items-center justify-center rounded-md border shadow-sm bg-primary text-primary-foreground",
          !showAvatar && "invisible"
        )}
      >
        <Sparkle />
      </div>
      <div className={cn("ml-4 flex-1 px-1", loading && "animate-pulse")}>
        {children}
      </div>
    </div>
  );
}

interface AssistantMessageProps {
  children: ReactNode;
}

export function AssistantMessage({ children }: AssistantMessageProps) {
  return (
    <div className="mt-2 flex items-center justify-center gap-2 text-xs text-gray-500">
      <div className="max-w-[600px] flex-initial p-2">{children}</div>
    </div>
  );
}
