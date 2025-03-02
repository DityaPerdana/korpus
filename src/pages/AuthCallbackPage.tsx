import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const AuthCallbackPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Handle email confirmation
    const handleEmailConfirmation = async () => {
      const error_description = searchParams.get("error_description");
      if (error_description) {
        navigate("/login", { state: { error: error_description } });
        return;
      }

      // Get the auth code from the URL
      const code = searchParams.get("code");
      if (code) {
        try {
          // Exchange the code for a session
          await supabase.auth.exchangeCodeForSession(code);
        } catch (error) {
          console.error("Error exchanging code for session:", error);
        }
      }

      // Check if user is logged in after code exchange
      if (!loading) {
        if (user) {
          navigate("/dashboard");
        } else {
          navigate("/login", {
            state: {
              message: "Authentication successful! You can now log in.",
            },
          });
        }
      }
    };

    handleEmailConfirmation();
  }, [user, loading, navigate, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      <p className="ml-2">Completing authentication...</p>
    </div>
  );
};

export default AuthCallbackPage;
