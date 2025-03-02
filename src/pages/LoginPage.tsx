import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const LoginPage = () => {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    setError("");

    try {
      console.log("Attempting to sign in with:", values.email);
      const { data, error } = await signIn(values.email, values.password);
      console.log("Sign in response:", { success: !!data && !error });

      if (error) {
        setError(error.message);
      } else {
        // Add a small delay to ensure state updates properly
        setTimeout(() => {
          navigate("/dashboard");
        }, 100);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for message from registration page
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
              {message}
            </div>
          )}
          <div className="mb-4 text-center text-sm text-muted-foreground">
            <p>For testing, you can use:</p>
            <p className="font-medium">Email: test@example.com</p>
            <p className="font-medium">Password: password123</p>
          </div>
          <LoginForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
