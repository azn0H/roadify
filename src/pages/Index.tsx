import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { 
  GraduationCap, 
  Shield, 
  Clock, 
  Star, 
  CheckCircle,
  Phone,
  Mail,
  MapPin
} from "lucide-react";

const courses = [
  {
    title: "Basic Driving Course",
    description: "Perfect for beginners. Learn the fundamentals of safe driving.",
    price: "299",
    duration: "4 weeks",
    lessons: 12,
    rating: 4.8,
    instructor: "Sarah Johnson"
  },
  {
    title: "Intensive Course",
    description: "Fast-track your learning with our comprehensive intensive program.",
    price: "599", 
    duration: "2 weeks",
    lessons: 20,
    rating: 4.9,
    instructor: "Mike Chen",
    isPopular: true
  },
  {
    title: "Advanced Driving",
    description: "Master advanced techniques and defensive driving strategies.",
    price: "399",
    duration: "3 weeks", 
    lessons: 15,
    rating: 4.7,
    instructor: "Emma Davis"
  }
];

const Index = () => {
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      
      {/* Courses Section */}
      <section id="courses" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-primary/10 text-primary mb-4">
              Our Courses
            </Badge>
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Choose Your Learning Path
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From beginner to advanced, we have the perfect course to match your needs and schedule.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Why Students Choose Rodify
            </h2>
            <p className="text-xl text-muted-foreground">
              Experience the difference with our professional approach to driving education
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <GraduationCap className="h-12 w-12 text-primary" />,
                title: "Expert Instructors",
                description: "Certified professionals with years of teaching experience"
              },
              {
                icon: <Shield className="h-12 w-12 text-primary" />,
                title: "Safety First",
                description: "Comprehensive safety training and modern, well-maintained vehicles"
              },
              {
                icon: <Clock className="h-12 w-12 text-primary" />,
                title: "Flexible Timing",
                description: "Book lessons that fit your schedule with our easy booking system"
              },
              {
                icon: <Star className="h-12 w-12 text-primary" />,
                title: "High Success Rate",
                description: "95% of our students pass their driving test on the first attempt"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Ready to Start Your Driving Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join hundreds of successful students who learned to drive with confidence at Rodify.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" size="lg" className="bg-white text-primary hover:bg-white/90" onClick={handleGetStarted}>
            {user ? "Go to Dashboard" : "Book Your First Lesson"}
          </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Get in Touch
            </h2>
            <p className="text-xl text-muted-foreground">
              Have questions? We're here to help you start your driving journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: <Phone className="h-8 w-8 text-primary" />,
                title: "Call Us",
                details: "+1 (555) 123-4567",
                subtitle: "Mon-Fri 8AM-6PM"
              },
              {
                icon: <Mail className="h-8 w-8 text-primary" />,
                title: "Email Us", 
                details: "info@rodify.com",
                subtitle: "We'll respond within 24 hours"
              },
              {
                icon: <MapPin className="h-8 w-8 text-primary" />,
                title: "Visit Us",
                details: "123 Driving School St",
                subtitle: "Downtown, City 12345"
              }
            ].map((contact, index) => (
              <div key={index} className="text-center p-6 bg-card rounded-lg shadow-card">
                <div className="flex justify-center mb-4">
                  {contact.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                  {contact.title}
                </h3>
                <p className="text-lg font-medium text-primary mb-1">
                  {contact.details}
                </p>
                <p className="text-sm text-muted-foreground">
                  {contact.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-sidebar border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <GraduationCap className="h-8 w-8 text-sidebar-primary" />
              <span className="text-2xl font-bold text-sidebar-foreground">Rodify</span>
            </div>
            <p className="text-sidebar-foreground/70 text-center md:text-right">
              © 2024 Rodify Driving School. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
