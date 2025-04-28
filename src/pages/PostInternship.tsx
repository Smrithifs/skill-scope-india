
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Plus } from "lucide-react";
import { useData } from "@/contexts/DataContext";

// Form schema validation with Zod
const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  company: z.string().min(2, "Company name is required"),
  companyLogo: z.any().optional(),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  responsibilities: z.array(
    z.string().min(5, "Responsibility must be at least 5 characters")
  ),
  requirements: z.array(
    z.string().min(5, "Requirement must be at least 5 characters")
  ),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  stipend: z.coerce
    .number()
    .positive("Stipend must be a positive number")
    .optional(),
  durationMonths: z.coerce
    .number()
    .int()
    .positive("Duration must be a positive integer"),
  deadline: z.string().min(1, "Application deadline is required"),
  isRemote: z.boolean().default(false),
  skills: z.array(z.string()),
  slots: z.coerce.number().int().positive("Number of openings must be positive"),
});

const categories = [
  "Technology",
  "Marketing",
  "Finance",
  "Human Resources",
  "Design",
  "Business",
  "Data Science",
  "Content",
  "Operations",
  "Research",
  "Engineering",
  "Product Management",
];

const skillsList = [
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "HTML/CSS",
  "SQL",
  "Data Analysis",
  "UI/UX Design",
  "Digital Marketing",
  "Content Writing",
  "Graphic Design",
  "Excel",
  "Financial Analysis",
  "Communication",
  "Project Management",
  "Machine Learning",
  "Photoshop",
  "iOS",
  "Android",
];

const PostInternship = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addInternship } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      company: "",
      companyLogo: "",
      category: "",
      description: "",
      responsibilities: [""],
      requirements: [""],
      city: "",
      state: "",
      stipend: 0,
      durationMonths: 3,
      deadline: "",
      isRemote: false,
      skills: [skillsList[0]],  // Initialize with the first item from skillsList
      slots: 1,
    },
  });

  const appendResponsibility = () => {
    const responsibilities = form.getValues("responsibilities");
    form.setValue("responsibilities", [...responsibilities, ""]);
  };

  const removeResponsibility = (index: number) => {
    const responsibilities = form.getValues("responsibilities").filter(
      (_, i) => i !== index
    );
    form.setValue("responsibilities", responsibilities);
  };

  const appendRequirement = () => {
    const requirements = form.getValues("requirements");
    form.setValue("requirements", [...requirements, ""]);
  };

  const removeRequirement = (index: number) => {
    const requirements = form.getValues("requirements").filter(
      (_, i) => i !== index
    );
    form.setValue("requirements", requirements);
  };

  const appendSkill = () => {
    const skills = form.getValues("skills");
    form.setValue("skills", [...skills, skillsList[0]]);  // Adding the first skill from skillsList
  };

  const removeSkill = (index: number) => {
    const skills = form.getValues("skills").filter((_, i) => i !== index);
    form.setValue("skills", skills);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Try to get authenticated user session
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        toast({
          title: "Authentication required",
          description: "Please sign in as a recruiter to post internships",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // Check if user is a recruiter
      const { data: recruiterData } = await supabase
        .from("recruiters")
        .select("id")
        .eq("user_id", sessionData.session.user.id)
        .single();

      if (!recruiterData) {
        toast({
          title: "Permission denied",
          description: "Only recruiters can post internships",
          variant: "destructive",
        });
        return;
      }

      // Prepare location object
      const location = {
        city: values.city,
        state: values.state,
        country: "India",
      };

      // Filter out empty strings from arrays
      const responsibilities = values.responsibilities.filter(
        (item) => item.trim() !== ""
      );
      const requirements = values.requirements.filter(
        (item) => item.trim() !== ""
      );
      const skills = values.skills.filter((item) => item.trim() !== "");

      // Format the deadline date string
      const formattedDeadline = new Date(values.deadline).toISOString();

      // Prepare internship data
      const internshipData = {
        title: values.title,
        company: values.company,
        company_logo: values.companyLogo,
        category: values.category,
        description: values.description,
        responsibilities: responsibilities,
        requirements: requirements,
        location: location,
        stipend: values.stipend,
        duration_months: values.durationMonths,
        deadline: formattedDeadline,
        is_remote: values.isRemote,
        skills: skills,
        slots: values.slots,
        recruiter_id: recruiterData.id,
      };

      // Insert internship into Supabase
      const { error } = await supabase
        .from("internships")
        .insert(internshipData);

      if (error) throw error;

      toast({
        title: "Internship posted successfully",
        description: "Your internship has been published.",
      });

      navigate("/recruiter");
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
    <div className="bg-gray-50 py-8 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Post a New Internship</h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              {/* Basic Information */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h2 className="text-lg font-semibold mb-4">
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Internship Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Frontend Developer Intern"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Company Name" {...field} />
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
                        <FormLabel>Category</FormLabel>
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
                            {categories.map((category) => (
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
                  <FormField
                    control={form.control}
                    name="companyLogo"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Company Logo URL (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://yourcompany.com/logo.png"
                            {...field}
                            value={value as string}
                            onChange={(e) => onChange(e.target.value)}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a URL to your company logo
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h2 className="text-lg font-semibold mb-4">Description</h2>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Internship Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the internship in detail..."
                          className="h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Responsibilities */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h2 className="text-lg font-semibold mb-4">
                  Responsibilities
                </h2>
                {form.watch("responsibilities").map((_, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <FormField
                      control={form.control}
                      name={`responsibilities.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder={`Responsibility ${index + 1}`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeResponsibility(index)}
                      disabled={form.watch("responsibilities").length <= 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2"
                  onClick={appendResponsibility}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Responsibility
                </Button>
              </div>

              {/* Requirements */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h2 className="text-lg font-semibold mb-4">Requirements</h2>
                {form.watch("requirements").map((_, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <FormField
                      control={form.control}
                      name={`requirements.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder={`Requirement ${index + 1}`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeRequirement(index)}
                      disabled={form.watch("requirements").length <= 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2"
                  onClick={appendRequirement}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Requirement
                </Button>
              </div>

              {/* Location */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h2 className="text-lg font-semibold mb-4">Location</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Mumbai" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="Maharashtra" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isRemote"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>This is a remote internship</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Details */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h2 className="text-lg font-semibold mb-4">
                  Internship Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="stipend"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stipend (₹ per month)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="10000"
                            {...field}
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
                        <FormLabel>Duration (months)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="12"
                            placeholder="3"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Deadline</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
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
                        <FormLabel>Number of Openings</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="1"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h2 className="text-lg font-semibold mb-4">Skills Required</h2>
                {form.watch("skills").map((_, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <FormField
                      control={form.control}
                      name={`skills.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Select
                            onValueChange={(value) => {
                              form.setValue(`skills.${index}`, value);
                            }}
                            defaultValue={field.value}
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeSkill(index)}
                      disabled={form.watch("skills").length <= 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2"
                  onClick={appendSkill}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Skill
                </Button>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Posting..." : "Post Internship"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default PostInternship;
