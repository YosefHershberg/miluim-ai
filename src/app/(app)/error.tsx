"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="py-8 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
          <h2 className="text-lg font-semibold">שגיאה</h2>
          <p className="text-sm text-muted-foreground">
            {error.message || "אירעה שגיאה בלתי צפויה"}
          </p>
          <Button onClick={reset}>נסה שוב</Button>
        </CardContent>
      </Card>
    </div>
  );
}
