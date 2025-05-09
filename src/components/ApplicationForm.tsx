
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface ApplicationFormProps {
  internshipId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ApplicationForm({ internshipId, isOpen, onClose }: ApplicationFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, userType, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    degree: '',
    graduationYear: '',
    college: '',
    coverLetter: '',
    resume: null as File | null,
  });

  useEffect(() => {
    if (profile && userType === 'student') {
      setFormData(prev => ({
        ...prev,
        fullName: profile.full_name || '',
        email: profile.email || '',
        degree: profile.degree || '',
        graduationYear: profile.graduation_year ? String(profile.graduation_year) : '',
        college: profile.college || '',
      }));
    }
  }, [profile, userType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to apply for internships.",
          variant: "destructive",
        });
        onClose();
        navigate('/auth');
        return;
      }

      if (userType !== 'student') {
        toast({
          title: "Student account required",
          description: "Only students can apply for internships.",
          variant: "destructive",
        });
        return;
      }

      let studentId = profile?.id;

      if (!studentId) {
        const { data, error } = await supabase
          .from('students')
          .insert({
            user_id: user.id,
            full_name: formData.fullName,
            email: formData.email,
            degree: formData.degree,
            graduation_year: formData.graduationYear ? parseInt(formData.graduationYear) : null,
            college: formData.college,
          })
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }
        studentId = data.id;
      } else {
        const { error } = await supabase
          .from('students')
          .update({
            full_name: formData.fullName,
            email: formData.email,
            degree: formData.degree,
            graduation_year: formData.graduationYear ? parseInt(formData.graduationYear) : null,
            college: formData.college,
          })
          .eq('id', studentId);

        if (error) {
          throw new Error(error.message);
        }
      }

      let resumeUrl = '';
      if (formData.resume) {
        // Create storage bucket if it doesn't exist (this will be handled automatically by Supabase)
        const fileExt = formData.resume.name.split('.').pop();
        const fileName = `${studentId}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(fileName, formData.resume);

        if (uploadError) {
          throw new Error(uploadError.message);
        }
        resumeUrl = fileName;
      }

      const { data: internship } = await supabase
        .from('internships')
        .select('recruiter_id')
        .eq('id', internshipId)
        .single();

      if (!internship) {
        throw new Error('Internship not found');
      }

      const { error: applicationError } = await supabase
        .from('applications')
        .insert({
          internship_id: internshipId,
          student_id: studentId,
          resume_url: resumeUrl || null,
          cover_letter: formData.coverLetter || null,
          recruiter_id: internship.recruiter_id,
          status: 'applied',
          application_date: new Date().toISOString(),
        });

      if (applicationError) {
        throw new Error(applicationError.message);
      }

      const { error: updateError } = await supabase.rpc('increment_applications_count', {
        internship_id: internshipId
      });

      if (updateError) {
        console.error('Failed to update applications count:', updateError);
      }

      toast({
        title: "Application submitted!",
        description: "Your application has been successfully submitted.",
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while submitting your application.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isOpen && !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to apply for internships.",
      });
      onClose();
      navigate('/auth');
    }
  }, [isOpen, user, isLoading, navigate, onClose, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Apply for Internship</DialogTitle>
          <DialogDescription>
            Please fill out the form below to submit your application.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name*</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email*</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="college">College/University</Label>
              <Input
                id="college"
                name="college"
                value={formData.college}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="degree">Degree</Label>
              <Input
                id="degree"
                name="degree"
                value={formData.degree}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="graduationYear">Graduation Year</Label>
            <Input
              id="graduationYear"
              name="graduationYear"
              type="number"
              min="2020"
              max="2030"
              value={formData.graduationYear}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleInputChange}
              placeholder="Why are you interested in this internship?"
              className="h-24"
            />
          </div>
          
          <div>
            <Label htmlFor="resume">Resume</Label>
            <Input
              id="resume"
              name="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload your resume (PDF, DOC, or DOCX)
            </p>
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
