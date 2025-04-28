import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useToast } from "@/hooks/use-toast";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Internship } from '@/types';
import { internshipCategories, indianCities, indianStates, skillsList } from '@/data/mockData';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  company: z.string().min(2, "Company name is required"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  responsibilities: z.array(z.string().min(5, "Each responsibility must be at least 5 characters")).min(1),
  requirements: z.array(z.string().min(5, "Each requirement must be at least 5 characters")).min(1),
  location: z.object({
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().default("India"),
  }),
  stipend: z.number().min(0, "Stipend must be a positive number"),
  durationMonths: z.number().min(1, "Duration must be at least 1 month"),
  deadline: z.string().min(1, "Deadline is required"),
  isRemote: z.boolean(),
  skills: z.array(z.string().min(1, "Skill is required")).min(1),
  slots: z.number().min(1, "Number of slots must be at least 1"),
});

type FormValues = z.infer<typeof formSchema>;

const PostInternship = () => {
  const navigate = useNavigate();
  const { addInternship } = useData();
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      company: "",
      category: "",
      description: "",
      responsibilities: [""],
      requirements: [""],
      location: {
        city: "",
        state: "",
        country: "India",
      },
      stipend: 0,
      durationMonths: 3,
      deadline: "",
      isRemote: false,
      skills: [""],
      slots: 1,
    },
  });
  
  const { fields: responsibilityFields, append: appendResponsibility, remove: removeResponsibility } = 
    useFieldArray({ control: form.control, name: "responsibilities" });
  
  const { fields: requirementFields, append: appendRequirement, remove: removeRequirement } = 
    useFieldArray({ control: form.control, name: "requirements" });
  
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = 
    useFieldArray({ control: form.control, name: "skills" });
  
  const onSubmit = (values: FormValues) => {
    const newInternship: Internship = {
      id: `intern-${Date.now()}`,
      title: values.title,
      company: values.company,
      category: values.category,
      description: values.description,
      responsibilities: values.responsibilities,
      requirements: values.requirements,
      location: {
        city: values.location.city,
        state: values.location.state,
        country: values.location.country
      },
      stipend: values.stipend,
      durationMonths: values.durationMonths,
      postedDate: new Date().toISOString().split('T')[0],
      deadline: values.deadline,
      isRemote: values.isRemote,
      skills: values.skills,
      slots: values.slots,
      applicationsCount: 0,
      recruiterId: '1',
    };
    
    addInternship(newInternship);
    
    toast({
      title: "Internship Posted!",
      description: "Your internship has been successfully posted.",
    });
    
    navigate('/recruiter');
  };
  
  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Post a New Internship</CardTitle>
            <CardDescription>
              Create a new internship opportunity for students across India.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Internship Title*</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Frontend Developer Intern" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name*</FormLabel>
                            <FormControl>
                              <Input placeholder="Your company name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category*</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {internshipCategories.slice(1).map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description*</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the internship, company, and what the intern will learn"
                              className="min-h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Provide a detailed description of the internship opportunity.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold">Responsibilities & Requirements</h3>
                    
                    <div>
                      <Label>Responsibilities*</Label>
                      {responsibilityFields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 mt-2">
                          <Input
                            placeholder={`Responsibility ${index + 1}`}
                            {...form.register(`responsibilities.${index}`)}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeResponsibility(index)}
                            className="flex-shrink-0"
                            disabled={responsibilityFields.length === 1}
                          >
                            -
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendResponsibility("")}
                        className="mt-2"
                      >
                        Add Responsibility
                      </Button>
                    </div>
                    
                    <div>
                      <Label>Requirements*</Label>
                      {requirementFields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 mt-2">
                          <Input
                            placeholder={`Requirement ${index + 1}`}
                            {...form.register(`requirements.${index}`)}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeRequirement(index)}
                            className="flex-shrink-0"
                            disabled={requirementFields.length === 1}
                          >
                            -
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendRequirement("")}
                        className="mt-2"
                      >
                        Add Requirement
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold">Location & Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="location.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City*</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a city" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {indianCities.slice(1).map((city) => (
                                  <SelectItem key={city} value={city}>
                                    {city}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="location.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State*</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a state" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {indianStates.slice(1).map((state) => (
                                  <SelectItem key={state} value={state}>
                                    {state}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="stipend"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monthly Stipend (₹)*</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="e.g. 10000"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="durationMonths"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration (Months)*</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                placeholder="e.g. 3"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="slots"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Positions*</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                placeholder="e.g. 2"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Application Deadline*</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="isRemote"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Remote Internship</FormLabel>
                              <FormDescription>
                                Can this internship be done remotely?
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold">Skills Required</h3>
                    
                    <div>
                      <Label>Skills*</Label>
                      {skillFields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 mt-2">
                          <Select 
                            onValueChange={(value) => {
                              form.setValue(`skills.${index}`, value);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={`Select skill ${index + 1}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {skillsList.map((skill) => (
                                <SelectItem key={skill} value={skill}>
                                  {skill}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeSkill(index)}
                            className="flex-shrink-0"
                            disabled={skillFields.length === 1}
                          >
                            -
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendSkill("")}
                        className="mt-2"
                      >
                        Add Skill
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/recruiter')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Post Internship</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostInternship;
