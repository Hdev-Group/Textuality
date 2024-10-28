import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
export function NotFoundError(){
    return (
      <div>
        <title>Not Found | Textuality</title>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full border-yellow-500 max-w-md z-50 pingpulseborderyellow">
            <CardContent className="pt-6 text-left items-start flex flex-col justify-start">
              <p>
                <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
              </p>
              <h2 className="text-2xl font-bold mb-2">Not Found</h2>
              <p className="text-muted-foreground">
                If we cant find it, Its not here no matter how much you try :(.<br />
              </p>
                <Button className="mt-4" variant="outline" onClick={() => window.history.back()}>Go Back</Button>
            </CardContent>
          </Card>
        </div>
        </div>
      );
}