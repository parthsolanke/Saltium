import { useState } from 'react';
import axios from 'axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SignUpCard from '@/components/RegistrationForm';

const API_URL = import.meta.env.VITE_API_URL;

export default function RegisterPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSignUpSuccess, setIsSignUpSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
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
      if (error.response?.data.message === 'User already exists') {
        setErrorMessage('A user with this email already exists. Please try logging in.');
      } else {
        console.error('Signup failed:', error.message);
        setErrorMessage('Signup failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Header />
      <SignUpCard 
        formData={formData}
        errorMessage={errorMessage}
        isSignUpSuccess={isSignUpSuccess}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
      <Footer />
    </div>
  );
}
