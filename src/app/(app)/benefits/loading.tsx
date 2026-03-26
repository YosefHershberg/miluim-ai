import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BenefitsLoading() {
  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Title */}
        <Skeleton className="h-8 w-36" />

        {/* Summary Banner */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="py-6 text-center space-y-2">
            <Skeleton className="h-4 w-36 mx-auto bg-primary-foreground/20" />
            <Skeleton className="h-10 w-28 mx-auto bg-primary-foreground/20" />
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-lg bg-muted">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-9 flex-1 rounded-md" />
          ))}
        </div>

        {/* Benefit Cards */}
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-5 w-36" />
                  </div>
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Disclaimer */}
        <Card className="border-amber-500/30">
          <CardContent className="py-4 flex gap-3">
            <Skeleton className="h-5 w-5 shrink-0 rounded" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
