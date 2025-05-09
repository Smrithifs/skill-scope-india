
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

type UserProfile = {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  type: 'student' | 'recruiter';
  [key: string]: any;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  userType: 'student' | 'recruiter' | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, type: 'student' | 'recruiter', name: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userType, setUserType] = useState<'student' | 'recruiter' | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setSession(session);
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (error: any) {
        console.error('Error initializing auth:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setUserType(null);
        }
      }
    );

    initializeAuth();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      // Check for student profile
      const { data: studentData } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (studentData) {
        setProfile({ ...studentData, type: 'student' });
        setUserType('student');
        return;
      }

      // Check for recruiter profile
      const { data: recruiterData } = await supabase
        .from('recruiters')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (recruiterData) {
        setProfile({ ...recruiterData, type: 'recruiter' });
        setUserType('recruiter');
        return;
      }

      // No profile found
      setProfile(null);
      setUserType(null);
    } catch (error: any) {
      console.error('Error fetching user profile:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to load user profile',
        variant: 'destructive',
      });
    }
  };

  // Simplified sign in function - allows any valid email format and password
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in',
      });
    } catch (error: any) {
      // For demo purposes, create account if doesn't exist
      try {
        await signUp(email, password, 'student', email.split('@')[0]);
      } catch (signupError: any) {
        toast({
          title: 'Authentication error',
          description: signupError.message,
          variant: 'destructive',
        });
      }
    }
  };

  const signUp = async (email: string, password: string, type: 'student' | 'recruiter', name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Create profile based on user type
      if (data.user) {
        if (type === 'student') {
          await supabase.from('students').insert({
            user_id: data.user.id,
            full_name: name,
            email: email,
          });
        } else {
          await supabase.from('recruiters').insert({
            user_id: data.user.id,
            full_name: name,
            email: email,
            company: 'Company Name', // Default placeholder
            position: 'Recruiter',    // Default placeholder
          });
        }
      }

      toast({
        title: 'Account created!',
        description: 'Your account has been successfully created',
      });
    } catch (error: any) {
      toast({
        title: 'Registration error',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      setUserType(null);
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to log out',
        variant: 'destructive',
      });
    }
  };

  const value = {
    session,
    user,
    profile,
    userType,
    isLoading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
