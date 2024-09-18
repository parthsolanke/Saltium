import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function SignUpCard() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSignUpSuccess, setIsSignUpSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSignUpSuccess(false);

    if (formData.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    try {
      await axios.post(`${API_URL}/private/auth/register`, {
        username: formData.email,
        password: formData.password
      });
      setIsSignUpSuccess(true);
      setFormData({ email: '', password: '' });
    } catch (error) {
      if (error.response && error.response.data.message === 'User already exists') {
        setErrorMessage('A user with this email already exists. Please try logging in.');
      } else {
        console.error('Signup failed:', error.message);
        setErrorMessage('Signup failed. Please try again.');
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password (min 8 characters)"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          {errorMessage && (
            <div className="text-red-500 text-sm text-center">
              {errorMessage}
            </div>
          )}

          {isSignUpSuccess && (
            <div className="text-green-500 text-sm text-center">
              Signup successful! You can now{' '}
              <Link to="/login" className="text-primary hover:underline">
                login here
              </Link>.
            </div>
          )}
        </CardContent>
        {!isSignUpSuccess && (
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">Sign Up</Button>
            <p className="text-sm text-center text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        )}
      </form>
    </Card>
  );
}
