import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "@/components/auth/RegisterForm";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const RegisterPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    setError("");

    try {
      const { error } = await signUp(values.email, values.password, {
        full_name: `${values.firstName} ${values.lastName}`,
      });

      if (error) {
        setError(error.message);
      } else {
        // Success - show confirmation message for OTP
        navigate("/login", {
          state: {
            message:
              "Registration successful! Please check your email for a one-time password (OTP) to log in.",
          },
        });
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <RegisterForm onSubmit={handleSubmit} />
      </main>

      <Footer />
    </div>
  );
};

export default RegisterPage;
