import PropTypes from 'prop-types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from 'react-router-dom';

export default function SignUpCard({ formData, errorMessage, isSignUpSuccess, onInputChange, onSubmit }) {
  return (
    <Card className="w-full max-w-md mx-auto bg-stone-50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={onInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password (min 8 characters)"
              value={formData.password}
              onChange={onInputChange}
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

SignUpCard.propTypes = {
  formData: PropTypes.shape({
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired
  }).isRequired,
  errorMessage: PropTypes.string,
  isSignUpSuccess: PropTypes.bool,
  onInputChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

SignUpCard.defaultProps = {
  errorMessage: '',
  isSignUpSuccess: false
};
