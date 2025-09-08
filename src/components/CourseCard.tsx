import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Users, Star } from "lucide-react";

interface CourseCardProps {
  title: string;
  description: string;
  price: string;
  duration: string;
  lessons: number;
  rating: number;
  instructor: string;
  isPopular?: boolean;
}

export function CourseCard({
  title,
  description,
  price,
  duration,
  lessons,
  rating,
  instructor,
  isPopular = false
}: CourseCardProps) {
  return (
    <Card className="relative h-full shadow-card hover:shadow-hero transition-all duration-300 hover:-translate-y-1">
      {isPopular && (
        <Badge className="absolute -top-3 left-6 bg-accent text-accent-foreground">
          Most Popular
        </Badge>
      )}
      
      <CardHeader>
        <CardTitle className="text-xl text-card-foreground">{title}</CardTitle>
        <p className="text-muted-foreground">{description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-primary">${price}</span>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-accent fill-current" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {duration}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {lessons} lessons included
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            Instructor: {instructor}
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          variant={isPopular ? "automotive" : "default"} 
          className="w-full"
        >
          Enroll Now
        </Button>
      </CardFooter>
    </Card>
  );
}