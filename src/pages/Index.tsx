
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import InternshipSearch from '@/components/InternshipSearch';
import InternshipCard from '@/components/InternshipCard';
import { Briefcase, User, Building } from 'lucide-react';
import { InternshipFilter } from '@/types';

const Hero = () => (
  <section className="bg-white py-16 md:py-24 border-b overflow-hidden hero-pattern">
    <div className="container mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        <div className="lg:w-1/2 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your Perfect <span className="text-brand-500">Internship</span> in India
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-lg">
            Connect with top companies across India and kickstart your career with the right opportunity.
          </p>
          <div className="max-w-md w-full">
            <InternshipSearch onSearch={(query) => {}} />
          </div>
          <div className="flex flex-wrap gap-6 mt-8">
            <Link to="/student">
              <Button className="bg-brand-500 hover:bg-brand-600">
                I'm a Student
              </Button>
            </Link>
            <Link to="/recruiter">
              <Button variant="outline">
                I'm a Recruiter
              </Button>
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2 relative">
          <img
            src="https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Students working together"
            className="rounded-lg shadow-2xl mx-auto"
            width={600}
            height={400}
          />
        </div>
      </div>
    </div>
  </section>
);

const Stats = () => (
  <section className="py-16 bg-gray-50">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="bg-brand-100 p-3 rounded-full mb-4">
            <Briefcase className="h-6 w-6 text-brand-500" />
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-2">1500+</h3>
          <p className="text-gray-600">Active Internships</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="bg-brand-100 p-3 rounded-full mb-4">
            <Building className="h-6 w-6 text-brand-500" />
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-2">500+</h3>
          <p className="text-gray-600">Partner Companies</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="bg-brand-100 p-3 rounded-full mb-4">
            <User className="h-6 w-6 text-brand-500" />
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-2">20,000+</h3>
          <p className="text-gray-600">Student Registrations</p>
        </div>
      </div>
    </div>
  </section>
);

const FeaturedInternships = () => {
  const { internships } = useData();
  
  // Get the latest 3 internships
  const featuredInternships = internships.slice(0, 3);
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Internships</h2>
            <p className="text-gray-600">Explore top opportunities from leading companies in India</p>
          </div>
          <Link to="/student">
            <Button variant="outline" className="mt-4 md:mt-0">
              View All Internships
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredInternships.map((internship) => (
            <InternshipCard key={internship.id} internship={internship} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Categories = () => {
  const categories = [
    { name: 'Software Development', icon: '💻', count: 245 },
    { name: 'Data Science', icon: '📊', count: 156 },
    { name: 'Marketing', icon: '📱', count: 132 },
    { name: 'Design', icon: '🎨', count: 98 },
    { name: 'Finance', icon: '💰', count: 87 },
    { name: 'Content Writing', icon: '✍️', count: 76 },
  ];
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Popular Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore internships across various fields and industries
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link to={`/student?category=${category.name}`} key={category.name}>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-3xl mb-4 block">{category.icon}</span>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.count} internships</p>
                  </div>
                  <div className="bg-brand-50 text-brand-700 text-xs font-medium px-2 py-1 rounded-full">
                    View
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      title: 'Search',
      description: 'Find the perfect internship based on your skills, interests and location.',
      icon: '🔍'
    },
    {
      title: 'Apply',
      description: 'Submit your application with just a few clicks through our streamlined process.',
      icon: '📝'
    },
    {
      title: 'Interview',
      description: 'Get shortlisted and showcase your potential to the recruiters.',
      icon: '🤝'
    },
    {
      title: 'Get Selected',
      description: 'Receive an offer and kickstart your career with the right opportunity.',
      icon: '🚀'
    }
  ];
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your journey to landing the perfect internship made simple
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative">
                <div className="bg-brand-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">{step.icon}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-brand-100 -z-10 transform -translate-x-1/2" />
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Computer Science Student',
      image: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      quote: 'SkillScopeIndia helped me find a remote internship that perfectly aligned with my career goals. The platform is super easy to use!'
    },
    {
      name: 'Rahul Patel',
      role: 'Marketing Graduate',
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      quote: 'Thanks to this platform, I secured an internship that later converted into a full-time role. The variety of opportunities available is impressive.'
    },
    {
      name: 'Neha Gupta',
      role: 'HR Manager, TechFirm',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      quote: 'As a recruiter, I\'ve found exceptional talent through SkillScopeIndia. The quality of applicants is consistently high.'
    }
  ];
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Success Stories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from students and recruiters who found success through our platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">&ldquo;{testimonial.quote}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CallToAction = () => (
  <section className="py-16 bg-brand-50">
    <div className="container mx-auto px-4">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="lg:w-2/3">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-xl text-gray-600 mb-6">
            Join thousands of students and companies on India's premier internship platform.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link to="/student">
            <Button size="lg" className="bg-brand-500 hover:bg-brand-600">
              Find Internships
            </Button>
          </Link>
          <Link to="/recruiter">
            <Button size="lg" variant="outline">
              Post an Internship
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const Index = () => {
  return (
    <div>
      <Hero />
      <Stats />
      <FeaturedInternships />
      <Categories />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default Index;
