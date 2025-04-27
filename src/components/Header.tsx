
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'For Students', href: '/student' },
    { name: 'For Recruiters', href: '/recruiter' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-brand-500 text-white p-2 rounded-md">
                <span className="font-bold text-xl">SI</span>
              </div>
              <span className="font-bold text-xl text-gray-800">
                SkillScope<span className="text-brand-500">India</span>
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-medium hover:text-brand-600 ${
                  location.pathname === item.href
                    ? 'text-brand-500'
                    : 'text-gray-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link to="/post-internship">Post Internship</Link>
            </Button>
          </div>

          {/* Mobile navigation */}
          <div className="md:hidden flex items-center">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>SkillScopeIndia</SheetTitle>
                  <SheetDescription>
                    India's premier internship platform
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`font-medium py-2 hover:text-brand-600 ${
                        location.pathname === item.href
                          ? 'text-brand-500'
                          : 'text-gray-600'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link 
                    to="/post-internship"
                    onClick={() => setIsOpen(false)}
                    className="bg-brand-500 text-white rounded-md py-2 px-4 text-center mt-4"
                  >
                    Post Internship
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
