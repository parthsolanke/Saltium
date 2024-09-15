import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, SearchX } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Header />
        <Card className="w-full max-w-md mx-auto">
        <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">404 - Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center" aria-hidden="true">
            <SearchX className="h-10 w-10" />
            </div>
            <p className="text-center text-muted-foreground">
            Oops! The page you&apos;re looking for seems to have vanished into thin air.
            </p>
        </CardContent>
        <CardFooter className="flex justify-center">
            <Button asChild>
            <Link to="/upload">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Upload
            </Link>
            </Button>
        </CardFooter>
        </Card>
        <Footer />
    </div>
  );
}
