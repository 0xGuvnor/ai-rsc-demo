import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Skeleton } from "../ui/skeleton";

export function PriceCardSkeleton() {
  return (
    <Card className="w-fit gap-5 p-6 flex items-centerx xjustify-between bg-background rounded-lg shadow-lg">
      <div className="flex flex-col items-center justify-between">
        <Skeleton className="w-40 h-12" />
        <div className="mt-4 flex items-center">
          <Skeleton className="h-6 w-10" />
          <span className="mx-2">•</span>
          <span>{format(new Date(), "MMM do hh:mmaa")}</span>
        </div>
      </div>

      <Skeleton className="h-20 w-28" />
    </Card>
  );
}
