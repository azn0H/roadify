import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import heroImage from "@/assets/hero-image.jpg";

export function HeroSection() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/student-dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background to-muted">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Professional driving instruction" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/70" />
      </div>
      
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Badge className="bg-accent/10 text-accent hover:bg-accent/20 border-accent/20">
              🚗 Professional Driving School
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-foreground">
              Master the Road with 
              <span className="text-primary block">Expert Instructors</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-lg">
              Professional driving lessons with certified instructors. 
              Learn at your own pace with flexible scheduling and comprehensive training.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="text-lg px-8 py-6" onClick={handleGetStarted}>
                {user ? "Go to Dashboard" : "Start Learning Today"}
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                View Courses
              </Button>
            </div>
            
            <div className="flex items-center gap-8 pt-8">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">500+ Students</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-accent fill-current" />
                <span className="text-sm text-muted-foreground">4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">95% Pass Rate</span>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="relative">
              <div className="bg-card rounded-2xl shadow-card p-8 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-6 text-card-foreground">Why Choose Rodify?</h3>
                <div className="space-y-4">
                  {[
                    "Certified Professional Instructors",
                    "Flexible Scheduling System", 
                    "Comprehensive Theory & Practice",
                    "Modern Training Vehicles",
                    "Personalized Learning Plans"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span className="text-card-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}