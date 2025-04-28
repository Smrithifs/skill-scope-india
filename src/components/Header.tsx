
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, LogIn, User } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { user, userType, profile, signOut } = useAuth();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'For Students', href: '/student' },
    { name: 'For Recruiters', href: '/recruiter' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

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
            {user ? (
              <>
                {userType === 'recruiter' && (
                  <Button variant="outline" asChild>
                    <Link to="/post-internship">Post Internship</Link>
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="rounded-full p-2">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      {profile?.full_name || user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate(userType === 'student' ? '/student' : '/recruiter')}>
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild>
                <Link to="/auth">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            )}
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
                  
                  {user ? (
                    <>
                      {userType === 'recruiter' && (
                        <Link 
                          to="/post-internship"
                          onClick={() => setIsOpen(false)}
                          className="font-medium py-2 text-gray-600 hover:text-brand-600"
                        >
                          Post Internship
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="mt-4 w-full bg-gray-100 text-gray-800 rounded-md py-2 px-4 text-center"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <Link 
                      to="/auth"
                      onClick={() => setIsOpen(false)}
                      className="bg-brand-500 text-white rounded-md py-2 px-4 text-center mt-4"
                    >
                      Sign In
                    </Link>
                  )}
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
