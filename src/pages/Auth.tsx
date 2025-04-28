
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

// Form schemas
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const studentSignupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  college: z.string().optional(),
  degree: z.string().optional(),
  graduationYear: z.coerce.number().optional(),
});

const recruiterSignupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  position: z.string().min(2, "Position must be at least 2 characters"),
});

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userType, setUserType] = useState<'student' | 'recruiter'>('student');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    
    checkUser();
  }, [navigate]);

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Student signup form
  const studentSignupForm = useForm<z.infer<typeof studentSignupSchema>>({
    resolver: zodResolver(studentSignupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      college: "",
      degree: "",
      graduationYear: undefined,
    },
  });

  // Recruiter signup form
  const recruiterSignupForm = useForm<z.infer<typeof recruiterSignupSchema>>({
    resolver: zodResolver(recruiterSignupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      company: "",
      position: "",
    },
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      // Determine user type and redirect accordingly
      const { data: studentData } = await supabase
        .from('students')
        .select()
        .eq('user_id', data.user.id);

      if (studentData && studentData.length > 0) {
        navigate('/student');
        return;
      }

      const { data: recruiterData } = await supabase
        .from('recruiters')
        .select()
        .eq('user_id', data.user.id);

      if (recruiterData && recruiterData.length > 0) {
        navigate('/recruiter');
        return;
      }

      // If no profile found, redirect to home
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentSignup = async (values: z.infer<typeof studentSignupSchema>) => {
    setIsLoading(true);
    try {
      // Register user with email and password
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
            user_type: 'student',
          },
        },
      });

      if (error) throw error;

      // Create student profile
      const { error: profileError } = await supabase
        .from('students')
        .insert({
          user_id: data.user?.id,
          full_name: values.fullName,
          email: values.email,
          college: values.college || null,
          degree: values.degree || null,
          graduation_year: values.graduationYear || null,
        });

      if (profileError) throw profileError;

      toast({
        title: "Registration successful",
        description: "Welcome to SkillScopeIndia!",
      });
      
      navigate('/student');
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecruiterSignup = async (values: z.infer<typeof recruiterSignupSchema>) => {
    setIsLoading(true);
    try {
      // Register user with email and password
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
            user_type: 'recruiter',
          },
        },
      });

      if (error) throw error;

      // Create recruiter profile
      const { error: profileError } = await supabase
        .from('recruiters')
        .insert({
          user_id: data.user?.id,
          full_name: values.fullName,
          email: values.email,
          company: values.company,
          position: values.position,
        });

      if (profileError) throw profileError;

      toast({
        title: "Registration successful",
        description: "Welcome to SkillScopeIndia!",
      });
      
      navigate('/recruiter');
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome to <span className="text-brand-500">SkillScopeIndia</span>
          </h1>
          <p className="mt-2 text-gray-600">
            India's premier internship platform
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center">
              {authMode === 'login' ? 'Login' : 'Create an Account'}
            </CardTitle>
            <CardDescription className="text-center">
              {authMode === 'login' 
                ? 'Sign in to your account to continue' 
                : 'Join SkillScopeIndia to access internship opportunities'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={userType} onValueChange={(value) => setUserType(value as 'student' | 'recruiter')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="student">I'm a Student</TabsTrigger>
                <TabsTrigger value="recruiter">I'm a Recruiter</TabsTrigger>
              </TabsList>
              
              {authMode === 'login' ? (
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input placeholder="john.doe@example.com" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                type={showPassword ? "text" : "password"}
                                className="pl-10"
                                {...field}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-3"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                </Form>
              ) : (
                <TabsContent value="student">
                  <Form {...studentSignupForm}>
                    <form onSubmit={studentSignupForm.handleSubmit(handleStudentSignup)} className="space-y-4">
                      <FormField
                        control={studentSignupForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input placeholder="John Doe" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={studentSignupForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input placeholder="john.doe@example.com" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={studentSignupForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  className="pl-10"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  className="absolute right-3 top-3"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-gray-400" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={studentSignupForm.control}
                        name="college"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>College/University (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="IIT Bombay" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={studentSignupForm.control}
                          name="degree"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Degree (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="B.Tech" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={studentSignupForm.control}
                          name="graduationYear"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Graduation Year (Optional)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="2024"
                                  min="2020"
                                  max="2030"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Signing Up..." : "Sign Up"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              )}

              <TabsContent value="recruiter">
                {authMode === 'signup' && (
                  <Form {...recruiterSignupForm}>
                    <form onSubmit={recruiterSignupForm.handleSubmit(handleRecruiterSignup)} className="space-y-4">
                      <FormField
                        control={recruiterSignupForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input placeholder="John Doe" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={recruiterSignupForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input placeholder="john.doe@example.com" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={recruiterSignupForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  className="pl-10"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  className="absolute right-3 top-3"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-gray-400" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={recruiterSignupForm.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company</FormLabel>
                            <FormControl>
                              <Input placeholder="TechSolutions Inc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={recruiterSignupForm.control}
                        name="position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Position</FormLabel>
                            <FormControl>
                              <Input placeholder="HR Manager" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Signing Up..." : "Sign Up"}
                      </Button>
                    </form>
                  </Form>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center w-full">
              {authMode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <Button variant="link" className="p-0 h-auto" onClick={() => setAuthMode('signup')}>
                    Sign up
                  </Button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <Button variant="link" className="p-0 h-auto" onClick={() => setAuthMode('login')}>
                    Login
                  </Button>
                </p>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
