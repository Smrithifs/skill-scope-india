
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ApplicationFormProps {
  internshipId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ApplicationForm({ internshipId, isOpen, onClose }: ApplicationFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    degree: '',
    graduationYear: '',
    resume: null as File | null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to apply for internships.",
          variant: "destructive",
        });
        return;
      }

      // Create or update student profile
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .upsert({
          user_id: userData.user.id,
          full_name: formData.fullName,
          email: formData.email,
          degree: formData.degree,
          graduation_year: parseInt(formData.graduationYear),
        })
        .select()
        .single();

      if (studentError) throw studentError;

      // Upload resume if provided
      let resumeUrl = '';
      if (formData.resume) {
        const fileExt = formData.resume.name.split('.').pop();
        const fileName = `${studentData.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(fileName, formData.resume);

        if (uploadError) throw uploadError;
        resumeUrl = fileName;
      }

      // Create application
      const { error: applicationError } = await supabase
        .from('applications')
        .insert({
          internship_id: internshipId,
          student_id: studentData.id,
          resume_url: resumeUrl || null,
        });

      if (applicationError) throw applicationError;

      toast({
        title: "Application submitted!",
        description: "Your application has been successfully submitted.",
      });

      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply for Internship</DialogTitle>
          <DialogDescription>
            Please fill out the form below to submit your application.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="degree">Degree</Label>
            <Input
              id="degree"
              value={formData.degree}
              onChange={e => setFormData(prev => ({ ...prev, degree: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="graduationYear">Graduation Year</Label>
            <Input
              id="graduationYear"
              type="number"
              min="2024"
              max="2030"
              value={formData.graduationYear}
              onChange={e => setFormData(prev => ({ ...prev, graduationYear: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="resume">Resume</Label>
            <Input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              required
            />
          </div>
          
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
