
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { MoveLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center max-w-md neumorph-flat p-8">
        <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
        <p className="text-xl mb-6">Oops! This page doesn't exist</p>
        <a href="/" className="inline-flex items-center gap-2 neumorph-flat p-3 px-4 rounded-full hover:neumorph-pressed transition-all duration-300">
          <MoveLeft className="h-5 w-5" />
          <span>Return to Home</span>
        </a>
      </div>
    </div>
  );
};

export default NotFound;
