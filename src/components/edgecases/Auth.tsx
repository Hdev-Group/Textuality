import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
export function IsAuthorizedEdge(){
    return (
      <div>
        <title>Not Authorised | Textuality</title>
        <img src="/authimg/restricted.png" className="absolute h-full z-0 w-full bg-contain" />
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full border-red-500 max-w-md z-50">
            <CardContent className="pt-6 text-left items-start flex flex-col justify-start">
              <p>
                <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              </p>
              <h2 className="text-2xl font-bold mb-2">Not Authorised</h2>
              <p className="text-muted-foreground">
                You are not authorised to access this page. <br />
                <span className="text-xs">Think this is wrong? Contact the page owner.</span>
              </p>
              <a href='/application/home'>
                <Button className="mt-4" variant="outline">Go Home</Button>
              </a>
            </CardContent>
          </Card>
        </div>
        </div>
      );
}
export function IsLoadedEdge(){
    return (
      <div>
        <title>Loading... | Textuality</title>
        <div className="flex items-center flex-col justify-center min-h-screen">
          <div className="flex items-center flex-col justify-center min-h-screen">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
            <p className="text-muted-foreground text-center mt-4">Loading.</p>
          </div>
        </div>
        </div>
      );
}