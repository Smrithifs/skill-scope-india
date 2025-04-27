
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-brand-500 text-white p-2 rounded-md">
                <span className="font-bold text-xl">SI</span>
              </div>
              <span className="font-bold text-xl text-gray-800">
                SkillScope<span className="text-brand-500">India</span>
              </span>
            </Link>
            <p className="mt-4 text-gray-600">
              Bridging talent with opportunity across India.
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-800 mb-4">Students</h3>
            <ul className="space-y-3">
              <li><Link to="/student" className="text-gray-600 hover:text-brand-500">Find Internships</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-brand-500">Resume Builder</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-brand-500">Career Resources</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-brand-500">Skills Assessment</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-800 mb-4">Recruiters</h3>
            <ul className="space-y-3">
              <li><Link to="/recruiter" className="text-gray-600 hover:text-brand-500">Post Internship</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-brand-500">Talent Search</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-brand-500">Employer Branding</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-brand-500">Hiring Insights</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-800 mb-4">Connect</h3>
            <ul className="space-y-3">
              <li><Link to="#" className="text-gray-600 hover:text-brand-500">About Us</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-brand-500">Contact</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-brand-500">Blog</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-brand-500">Partnerships</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} SkillScopeIndia. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link to="#" className="text-gray-600 hover:text-brand-500 text-sm">Privacy Policy</Link>
              <Link to="#" className="text-gray-600 hover:text-brand-500 text-sm">Terms of Service</Link>
              <Link to="#" className="text-gray-600 hover:text-brand-500 text-sm">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
