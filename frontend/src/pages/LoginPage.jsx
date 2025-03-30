import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginCard from '@/components/LoginForm';

const API_URL = import.meta.env.VITE_API_URL;

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const response = await axios.post(`${API_URL}/private/auth/login`, {
        username: formData.email,
        password: formData.password
      });
      localStorage.setItem('token', response.data.token);
      navigate('/');
      setFormData({ email: '', password: '' });
    } catch (error) {
      console.error('Login failed:', error.message);
      setErrorMessage('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Header />
      <LoginCard 
        formData={formData}
        errorMessage={errorMessage}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
      <Footer />
    </div>
  );
}
