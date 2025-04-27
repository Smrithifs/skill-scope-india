
import { Internship, Student, Recruiter, Application } from '@/types';

export const mockInternships: Internship[] = [
  {
    id: '1',
    title: 'Frontend Developer Intern',
    company: 'TechSolutions India',
    companyLogo: 'https://via.placeholder.com/80',
    category: 'Software Development',
    description: 'Join our team to develop cutting-edge web applications using React and TypeScript. This is an excellent opportunity for students interested in frontend development.',
    responsibilities: [
      'Develop and maintain frontend web applications',
      'Collaborate with the team to implement UI designs',
      'Write clean, efficient code',
      'Perform testing and debugging'
    ],
    requirements: [
      'Basic knowledge of HTML, CSS, and JavaScript',
      'Familiarity with React is a plus',
      'Currently pursuing a degree in Computer Science or related field',
      'Strong problem-solving skills'
    ],
    location: {
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India'
    },
    stipend: 15000,
    durationMonths: 3,
    postedDate: '2023-04-15',
    deadline: '2023-05-15',
    isRemote: true,
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript'],
    slots: 3,
    applicationsCount: 12,
    recruiterId: '1'
  },
  {
    id: '2',
    title: 'Data Science Intern',
    company: 'DataMinds',
    companyLogo: 'https://via.placeholder.com/80',
    category: 'Data Science',
    description: 'Work on real-world data projects and gain experience in machine learning and data analysis.',
    responsibilities: [
      'Analyze large datasets to extract insights',
      'Build and optimize machine learning models',
      'Visualize data findings to stakeholders',
      'Assist in data collection and preprocessing'
    ],
    requirements: [
      'Knowledge of Python and data analysis libraries',
      'Understanding of statistical concepts',
      'Currently pursuing a degree in Computer Science, Statistics, or related field',
      'Strong analytical skills'
    ],
    location: {
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India'
    },
    stipend: 20000,
    durationMonths: 6,
    postedDate: '2023-04-10',
    deadline: '2023-05-10',
    isRemote: false,
    skills: ['Python', 'Machine Learning', 'SQL', 'Data Visualization'],
    slots: 2,
    applicationsCount: 18,
    recruiterId: '2'
  },
  {
    id: '3',
    title: 'Marketing Intern',
    company: 'GrowthMarketers',
    companyLogo: 'https://via.placeholder.com/80',
    category: 'Marketing',
    description: 'Join our digital marketing team and learn about SEO, social media marketing, and content strategy.',
    responsibilities: [
      'Assist in creating marketing content',
      'Help manage social media campaigns',
      'Analyze marketing metrics',
      'Conduct market research'
    ],
    requirements: [
      'Strong communication skills',
      'Interest in digital marketing',
      'Currently pursuing a degree in Marketing, Business, or related field',
      'Creative mindset'
    ],
    location: {
      city: 'Delhi',
      state: 'Delhi',
      country: 'India'
    },
    stipend: 12000,
    durationMonths: 4,
    postedDate: '2023-04-12',
    deadline: '2023-05-12',
    isRemote: true,
    skills: ['Digital Marketing', 'Content Writing', 'Social Media', 'SEO'],
    slots: 5,
    applicationsCount: 25,
    recruiterId: '3'
  },
  {
    id: '4',
    title: 'Backend Developer Intern',
    company: 'CloudSystems',
    companyLogo: 'https://via.placeholder.com/80',
    category: 'Software Development',
    description: 'Develop backend services and APIs for our cloud-based products. Great opportunity to learn about scalable systems and cloud infrastructure.',
    responsibilities: [
      'Build and maintain backend services',
      'Design and implement APIs',
      'Write efficient database queries',
      'Ensure high-performance and availability'
    ],
    requirements: [
      'Knowledge of at least one programming language (Node.js, Python, Java)',
      'Basic understanding of databases',
      'Currently pursuing a degree in Computer Science or related field',
      'Problem-solving mindset'
    ],
    location: {
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India'
    },
    stipend: 18000,
    durationMonths: 6,
    postedDate: '2023-04-08',
    deadline: '2023-05-08',
    isRemote: false,
    skills: ['Node.js', 'API Development', 'MongoDB', 'Express'],
    slots: 2,
    applicationsCount: 15,
    recruiterId: '4'
  },
  {
    id: '5',
    title: 'UI/UX Design Intern',
    company: 'DesignCraft',
    companyLogo: 'https://via.placeholder.com/80',
    category: 'Design',
    description: 'Join our design team to create beautiful and functional user interfaces. Learn design thinking, wireframing, and prototyping techniques.',
    responsibilities: [
      'Create wireframes and prototypes',
      'Conduct user research',
      'Design intuitive user interfaces',
      'Collaborate with product and development teams'
    ],
    requirements: [
      'Knowledge of design tools like Figma or Adobe XD',
      'Interest in user experience design',
      'Currently pursuing a degree in Design, Computer Science, or related field',
      'Creative and detail-oriented'
    ],
    location: {
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India'
    },
    stipend: 15000,
    durationMonths: 3,
    postedDate: '2023-04-16',
    deadline: '2023-05-16',
    isRemote: true,
    skills: ['UI Design', 'UX Design', 'Figma', 'Adobe XD', 'Wireframing'],
    slots: 2,
    applicationsCount: 10,
    recruiterId: '5'
  },
  {
    id: '6',
    title: 'Financial Analyst Intern',
    company: 'FinWizard',
    companyLogo: 'https://via.placeholder.com/80',
    category: 'Finance',
    description: 'Learn about financial modeling, investment analysis, and market trends in this challenging internship.',
    responsibilities: [
      'Prepare financial reports',
      'Analyze market data',
      'Assist in investment research',
      'Develop financial models'
    ],
    requirements: [
      'Strong Excel skills',
      'Understanding of basic financial concepts',
      'Currently pursuing a degree in Finance, Economics, or related field',
      'Analytical mindset'
    ],
    location: {
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India'
    },
    stipend: 17000,
    durationMonths: 4,
    postedDate: '2023-04-14',
    deadline: '2023-05-14',
    isRemote: false,
    skills: ['Financial Analysis', 'Excel', 'Financial Modeling', 'Research'],
    slots: 3,
    applicationsCount: 8,
    recruiterId: '6'
  }
];

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '9876543210',
    college: 'IIT Delhi',
    degree: 'B.Tech Computer Science',
    graduationYear: 2024,
    skills: ['Python', 'React', 'Machine Learning'],
    profilePicture: 'https://via.placeholder.com/150',
    applications: ['1', '3']
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya@example.com',
    phone: '8765432109',
    college: 'NIT Trichy',
    degree: 'B.Tech Electronics',
    graduationYear: 2023,
    skills: ['C++', 'MATLAB', 'Circuit Design'],
    profilePicture: 'https://via.placeholder.com/150',
    applications: ['2']
  }
];

export const mockRecruiters: Recruiter[] = [
  {
    id: '1',
    name: 'Vikram Mehta',
    email: 'vikram@techsolutions.com',
    phone: '7654321098',
    company: 'TechSolutions India',
    position: 'HR Manager',
    companyLogo: 'https://via.placeholder.com/80',
    internships: ['1']
  },
  {
    id: '2',
    name: 'Anjali Gupta',
    email: 'anjali@dataminds.com',
    phone: '6543210987',
    company: 'DataMinds',
    position: 'Talent Acquisition Specialist',
    companyLogo: 'https://via.placeholder.com/80',
    internships: ['2']
  },
  {
    id: '3',
    name: 'Sanjay Kumar',
    email: 'sanjay@growthmarketers.com',
    phone: '5432109876',
    company: 'GrowthMarketers',
    position: 'Marketing Director',
    companyLogo: 'https://via.placeholder.com/80',
    internships: ['3']
  },
  {
    id: '4',
    name: 'Neha Singh',
    email: 'neha@cloudsystems.com',
    phone: '4321098765',
    company: 'CloudSystems',
    position: 'Technical Recruiter',
    companyLogo: 'https://via.placeholder.com/80',
    internships: ['4']
  },
  {
    id: '5',
    name: 'Ravi Verma',
    email: 'ravi@designcraft.com',
    phone: '3210987654',
    company: 'DesignCraft',
    position: 'Design Team Lead',
    companyLogo: 'https://via.placeholder.com/80',
    internships: ['5']
  },
  {
    id: '6',
    name: 'Sunita Joshi',
    email: 'sunita@finwizard.com',
    phone: '2109876543',
    company: 'FinWizard',
    position: 'HR Specialist',
    companyLogo: 'https://via.placeholder.com/80',
    internships: ['6']
  }
];

export const mockApplications: Application[] = [
  {
    id: '1',
    internshipId: '1',
    studentId: '1',
    applicationDate: '2023-04-17',
    coverLetter: 'I am very interested in this opportunity and believe my skills in React make me a good fit.',
    status: 'shortlisted',
    recruiterId: '1'
  },
  {
    id: '2',
    internshipId: '2',
    studentId: '2',
    applicationDate: '2023-04-15',
    coverLetter: 'With my experience in data analysis, I am excited to contribute to your projects.',
    status: 'applied',
    recruiterId: '2'
  },
  {
    id: '3',
    internshipId: '3',
    studentId: '1',
    applicationDate: '2023-04-18',
    coverLetter: 'I am eager to learn more about digital marketing and would love to join your team.',
    status: 'applied',
    recruiterId: '3'
  }
];

export const internshipCategories = [
  'All',
  'Software Development',
  'Data Science',
  'Marketing',
  'Finance',
  'Design',
  'Human Resources',
  'Engineering',
  'Content Writing',
  'Business Development',
  'Operations'
];

export const indianCities = [
  'All',
  'Bangalore',
  'Mumbai',
  'Delhi',
  'Chennai',
  'Hyderabad',
  'Pune',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Chandigarh',
  'Lucknow',
  'Kochi',
  'Indore',
  'Coimbatore',
  'Gurgaon',
  'Noida'
];

export const indianStates = [
  'All',
  'Karnataka',
  'Maharashtra',
  'Delhi',
  'Tamil Nadu',
  'Telangana',
  'West Bengal',
  'Gujarat',
  'Rajasthan',
  'Punjab',
  'Uttar Pradesh',
  'Kerala',
  'Madhya Pradesh',
  'Haryana'
];

export const skillsList = [
  'HTML', 'CSS', 'JavaScript', 'React', 'Angular', 'Vue.js', 'Node.js', 'Express', 
  'Python', 'Django', 'Flask', 'Java', 'Spring Boot', 'C++', 'C#', '.NET', 
  'PHP', 'Laravel', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Firebase',
  'AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes', 'Git', 'CI/CD',
  'Machine Learning', 'Data Analysis', 'Data Visualization', 'TensorFlow', 'PyTorch',
  'UI Design', 'UX Design', 'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator',
  'Content Writing', 'Copywriting', 'SEO', 'Digital Marketing', 'Social Media Marketing',
  'Financial Analysis', 'Financial Modeling', 'Excel', 'R', 'Tableau', 'Power BI'
];
