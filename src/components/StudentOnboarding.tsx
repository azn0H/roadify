import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useCourses } from '@/hooks/use-courses';
import { 
  CheckCircle, 
  Circle, 
  Book, 
  CreditCard, 
  Upload, 
  Clock, 
  Download,
  FileText
} from 'lucide-react';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed?: boolean;
  current?: boolean;
}

interface UserCourse {
  id: string;
  course_id: string;
  payment_status: string;
  documents_uploaded: boolean;
  instructor_confirmed: boolean;
  onboarding_step: number;
  course?: {
    id: string;
    name: string;
    description: string;
    price: number;
  };
}

export function StudentOnboarding() {
  const { user } = useAuth();
  const { courses } = useCourses();
  const { toast } = useToast();
  const [userCourse, setUserCourse] = useState<UserCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchUserCourse();
  }, [user]);

  const fetchUserCourse = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_courses')
      .select(`
        *,
        course:courses(id, name, description, price)
      `)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user course:', error);
    } else if (data) {
      setUserCourse(data);
    }
    setLoading(false);
  };

  const selectCourse = async (courseId: string) => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_courses')
      .insert({
        user_id: user.id,
        course_id: courseId,
        payment_status: 'pending',
        onboarding_step: 2
      })
      .select(`
        *,
        course:courses(id, name, description, price)
      `)
      .single();

    if (error) {
      toast({
        title: "Error selecting course",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setUserCourse(data);
      toast({
        title: "Course selected!",
        description: "Now proceed to payment.",
      });
    }
  };

  const handlePayment = async () => {
    if (!userCourse) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { courseId: userCourse.course_id }
      });

      if (error) throw error;
      
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      toast({
        title: "Payment error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('student-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('user_courses')
        .update({ 
          documents_uploaded: true,
          onboarding_step: 4
        })
        .eq('id', userCourse!.id);

      if (updateError) throw updateError;

      setUploadedFile(file);
      await fetchUserCourse();
      
      toast({
        title: "Document uploaded successfully!",
        description: "Waiting for instructor confirmation.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const downloadRequiredDocuments = () => {
    // Create a sample document template
    const docContent = `
DRIVING SCHOOL ENROLLMENT DOCUMENTS

Required Documents Checklist:
□ Valid ID (Driver's License, Passport, or State ID)
□ Proof of Residence (Utility bill, bank statement, or lease agreement)
□ Medical Certificate (if required by state/local regulations)
□ Emergency Contact Information

Please scan or photograph these documents clearly and upload them through the student portal.

Contact Information:
Phone: (555) 123-4567
Email: info@drivingschool.com
    `;
    
    const blob = new Blob([docContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'required-documents-template.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Template downloaded",
      description: "Check your downloads folder for the document template.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const currentStep = userCourse?.onboarding_step || 1;
  const isPaymentComplete = userCourse?.payment_status === 'paid';
  const documentsUploaded = userCourse?.documents_uploaded || false;
  const instructorConfirmed = userCourse?.instructor_confirmed || false;

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: "Choose a Course",
      description: "Select the driving course that best fits your needs",
      icon: <Book className="h-5 w-5" />,
      completed: currentStep > 1,
      current: currentStep === 1
    },
    {
      id: 2,
      title: "Make Payment",
      description: "Complete your course payment securely",
      icon: <CreditCard className="h-5 w-5" />,
      completed: isPaymentComplete,
      current: currentStep === 2 && !isPaymentComplete
    },
    {
      id: 3,
      title: "Upload Documents",
      description: "Download template and upload required documents",
      icon: <Upload className="h-5 w-5" />,
      completed: documentsUploaded,
      current: currentStep === 3 || (isPaymentComplete && !documentsUploaded)
    },
    {
      id: 4,
      title: "Wait for Confirmation",
      description: "Instructor will review and confirm your enrollment",
      icon: <Clock className="h-5 w-5" />,
      completed: instructorConfirmed,
      current: documentsUploaded && !instructorConfirmed
    },
    {
      id: 5,
      title: "Done",
      description: "Welcome! You can now book lessons",
      icon: <CheckCircle className="h-5 w-5" />,
      completed: instructorConfirmed,
      current: false
    }
  ];

  const progressPercentage = (steps.filter(step => step.completed).length / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Enrollment</h1>
          <p className="text-muted-foreground">Follow these steps to get started with your driving lessons</p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Progress Overview</CardTitle>
            <Progress value={progressPercentage} className="w-full" />
            <p className="text-sm text-muted-foreground">
              {Math.round(progressPercentage)}% Complete
            </p>
          </CardHeader>
        </Card>

        <div className="space-y-6">
          {steps.map((step) => (
            <Card key={step.id} className={`shadow-card transition-all ${
              step.current ? 'ring-2 ring-primary' : ''
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    step.completed 
                      ? 'bg-primary text-primary-foreground' 
                      : step.current 
                        ? 'bg-primary/10 text-primary border-2 border-primary'
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {step.completed ? <CheckCircle className="h-5 w-5" /> : step.icon}
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{step.title}</h3>
                        {step.completed && (
                          <Badge className="bg-green-100 text-green-800">Complete</Badge>
                        )}
                        {step.current && (
                          <Badge variant="outline" className="border-primary text-primary">Current Step</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>

                    {/* Step-specific content */}
                    {step.id === 1 && step.current && (
                      <div className="grid gap-4 md:grid-cols-2">
                        {courses.map((course) => (
                          <Card key={course.id} className="border-2 hover:border-primary transition-colors cursor-pointer">
                            <CardContent className="p-4">
                              <h4 className="font-semibold mb-2">{course.name}</h4>
                              <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-primary">${course.price}</span>
                                <Button 
                                  onClick={() => selectCourse(course.id)}
                                  variant="outline"
                                  size="sm"
                                >
                                  Select
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {step.id === 2 && step.current && userCourse && (
                      <div className="bg-gradient-secondary rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold">{userCourse.course?.name}</h4>
                            <p className="text-muted-foreground">Course fee</p>
                          </div>
                          <span className="text-2xl font-bold text-primary">
                            ${userCourse.course?.price}
                          </span>
                        </div>
                        <Button onClick={handlePayment} className="w-full" variant="automotive">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay Now
                        </Button>
                      </div>
                    )}

                    {step.id === 3 && step.current && (
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <Button 
                            onClick={downloadRequiredDocuments}
                            variant="outline"
                            className="flex-1"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Template
                          </Button>
                        </div>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                          <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-4">
                            Upload your completed documents (PDF, JPG, PNG)
                          </p>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="document-upload"
                          />
                          <label htmlFor="document-upload">
                            <Button variant="outline" className="cursor-pointer">
                              <Upload className="h-4 w-4 mr-2" />
                              Choose Files
                            </Button>
                          </label>
                          {uploadedFile && (
                            <p className="text-sm text-green-600 mt-2">
                              Uploaded: {uploadedFile.name}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {step.id === 4 && step.current && (
                      <div className="bg-gradient-secondary rounded-lg p-4 text-center">
                        <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <p className="text-muted-foreground">
                          Your documents are being reviewed by our instructors. 
                          You'll be notified once confirmed.
                        </p>
                      </div>
                    )}

                    {step.id === 5 && step.completed && (
                      <div className="bg-gradient-primary rounded-lg p-4 text-center text-primary-foreground">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                        <p className="font-semibold">
                          Congratulations! You're all set to start learning.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}