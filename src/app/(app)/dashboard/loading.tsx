import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Welcome heading */}
        <Skeleton className="h-8 w-48" />

        {/* Total Days Hero Card */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="py-8 text-center space-y-2">
            <Skeleton className="h-4 w-32 mx-auto bg-primary-foreground/20" />
            <Skeleton className="h-12 w-20 mx-auto bg-primary-foreground/20" />
            <Skeleton className="h-4 w-24 mx-auto bg-primary-foreground/20" />
          </CardContent>
        </Card>

        {/* Year Breakdown Card */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-28" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-10" />
                <div className="flex items-center gap-3 flex-1 mx-4">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <Skeleton className="h-full w-2/3 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="py-4 flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
