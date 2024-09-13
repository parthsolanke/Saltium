import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SignUpCard from '@/components/RegistrationForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Header />
      <SignUpCard />
      <Footer />
    </div>
  );
}
