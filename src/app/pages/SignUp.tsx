import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { Eye, EyeOff, GraduationCap, Sparkles } from 'lucide-react';

export default function SignUp() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    // Validate email domain
    if (!formData.email.endsWith('@newhorizonindia.edu')) {
      toast.error('Email must end with @newhorizonindia.edu');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    const result = await signup(formData.email, formData.phone, formData.password, formData.name);
    setLoading(false);

    if (result.success) {
      toast.success('Account created successfully!');
      navigate('/');
    } else {
      toast.error(result.error || 'Failed to create account');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-600 via-amber-600 to-orange-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-amber-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-4 pb-8">
          <div className="flex items-center justify-center relative">
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
            </div>
            <div className="bg-gradient-to-br from-amber-600 to-orange-600 p-4 rounded-2xl shadow-xl">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl text-center bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <CardDescription className="text-center text-base">
            Join the student marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-gray-300 focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@college.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border-gray-300 focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
              <Input
                id="phone"
                placeholder="10-digit mobile number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                maxLength={10}
                className="border-gray-300 focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="border-gray-300 focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="border-gray-300 focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg text-base py-6" 
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>

            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}