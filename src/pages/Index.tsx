import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { useLanguage } from "@/hooks/use-language";
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

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userRole } = useProfile();
  const { t } = useLanguage();

  const courses = [
    {
      title: t('courses.basic.title'),
      description: t('courses.basic.description'),
      price: "299",
      duration: "4 weeks",
      lessons: 12,
      rating: 4.8,
      instructor: "Sarah Johnson"
    },
    {
      title: t('courses.intensive.title'),
      description: t('courses.intensive.description'),
      price: "599", 
      duration: "2 weeks",
      lessons: 20,
      rating: 4.9,
      instructor: "Mike Chen",
      isPopular: true
    },
    {
      title: t('courses.advanced.title'),
      description: t('courses.advanced.description'),
      price: "399",
      duration: "3 weeks", 
      lessons: 15,
      rating: 4.7,
      instructor: "Emma Davis"
    }
  ];

  const handleGetStarted = () => {
    if (user && userRole) {
      // Redirect based on user role
      switch (userRole) {
        case 'student':
          navigate('/student-dashboard');
          break;
        case 'teacher':
          navigate('/teacher-dashboard');
          break;
        case 'admin':
          navigate('/admin-dashboard');
          break;
        default:
          navigate('/student-dashboard');
      }
    } else if (user) {
      // User exists but role not loaded yet, default to student
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
              {t('courses.badge')}
            </Badge>
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              {t('courses.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('courses.subtitle')}
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
              {t('features.title')}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('features.subtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <GraduationCap className="h-12 w-12 text-primary" />,
                title: t('features.expert.title'),
                description: t('features.expert.description')
              },
              {
                icon: <Shield className="h-12 w-12 text-primary" />,
                title: t('features.safety.title'),
                description: t('features.safety.description')
              },
              {
                icon: <Clock className="h-12 w-12 text-primary" />,
                title: t('features.flexible.title'),
                description: t('features.flexible.description')
              },
              {
                icon: <Star className="h-12 w-12 text-primary" />,
                title: t('features.success.title'),
                description: t('features.success.description')
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
            {t('cta.title')}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" size="lg" className="bg-white text-primary hover:bg-white/90" onClick={handleGetStarted}>
            {user ? t('cta.goToDashboard') : t('cta.bookFirst')}
          </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              {t('cta.contact')}
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              {t('contact.title')}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('contact.subtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: <Phone className="h-8 w-8 text-primary" />,
                title: t('contact.call'),
                details: "+1 (555) 123-4567",
                subtitle: t('contact.callTime')
              },
              {
                icon: <Mail className="h-8 w-8 text-primary" />,
                title: t('contact.email'), 
                details: "info@rodify.com",
                subtitle: t('contact.emailResponse')
              },
              {
                icon: <MapPin className="h-8 w-8 text-primary" />,
                title: t('contact.visit'),
                details: "123 Driving School St",
                subtitle: t('contact.address')
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
              {t('footer.rights')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
