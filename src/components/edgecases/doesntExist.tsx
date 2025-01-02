import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import Head from "next/head";
import { useRouter } from "next/navigation";

export default function DoesntExist() {
    const Router = useRouter();
    return (
        <div>
        <Head>
          <title>404 | Textuality</title>
        </Head>
        <div className="flex items-center justify-center min-h-screen">
          <img src="/authimg/restricted.png" className="absolute h-full z-0 w-full bg-contain" />
          <Card className="w-full border-red-500 max-w-md z-50 pingpulseborder">
            <CardContent className="pt-6 text-left items-start flex flex-col justify-start">
              <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">This page does not exist.</h2>
              <p className="text-muted-foreground">
                The page you are looking for does not exist.
                <br />
                <span className="text-xs">Think this is wrong? Contact the page owner.</span>
              </p>
              <Button className="mt-4" variant="outline" onClick={() => Router.push('/application/home')}>
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
 }