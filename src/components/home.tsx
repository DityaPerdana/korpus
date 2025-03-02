import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import TestimonialsSection from "./TestimonialsSection";
import Footer from "./Footer";
import { BookOpen, CheckCircle, FileText } from "lucide-react";

interface HomePageProps {
  className?: string;
}

const HomePage = ({ className = "" }: HomePageProps) => {
  const navigate = useNavigate();

  // Handler for CTA button click in hero section
  const handleGetStarted = () => {
    navigate("/register");
  };

  // Features data
  const features = [
    {
      icon: BookOpen,
      title: "Course Modules",
      description:
        "Access comprehensive learning modules designed to enhance your educational journey with interactive content and resources.",
    },
    {
      icon: CheckCircle,
      title: "Interactive Quizzes",
      description:
        "Test your knowledge with our interactive quizzes designed to reinforce learning concepts and provide immediate feedback.",
    },
    {
      icon: FileText,
      title: "Assignments",
      description:
        "Complete practical assignments that help apply theoretical knowledge to real-world scenarios and build your portfolio.",
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Computer Science Student",
      content:
        "Corvus LMS has transformed my learning experience. The interactive modules and quizzes have helped me grasp complex concepts more easily.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Data Science Professional",
      content:
        "As someone transitioning careers, Corvus provided the structure I needed to learn at my own pace. The assignment feedback has been invaluable.",
      rating: 4,
    },
    {
      name: "Priya Patel",
      role: "Web Development Student",
      content:
        "The project-based learning approach on Corvus helped me build a portfolio while learning. I've already landed my first internship!",
      rating: 5,
    },
  ];

  return (
    <div className={`min-h-screen flex flex-col bg-background ${className}`}>
      {/* Header */}
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection
          title="Empower Your Learning Journey"
          description="Corvus LMS provides a comprehensive platform for students and educators to connect, learn, and grow together. Join our community today and unlock your full potential."
          ctaText="Get Started"
          onCtaClick={handleGetStarted}
          backgroundImage="https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
        />

        {/* Features Section */}
        <FeaturesSection
          title="Platform Features"
          subtitle="Discover the powerful tools that make learning effective and engaging"
          features={features}
        />

        {/* Testimonials Section */}
        <TestimonialsSection
          title="What Our Students Say"
          subtitle="Hear from learners who have transformed their educational journey with Corvus LMS"
          testimonials={testimonials}
        />

        {/* Additional Content Section - Call to Action */}
        <section className="w-full py-20 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Learning?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
              Join thousands of students already learning on our platform.
              Register today and take the first step towards advancing your
              education.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate("/register")}
                className="px-8 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Register Now
              </button>
              <button
                onClick={() => navigate("/courses")}
                className="px-8 py-3 bg-white border border-primary text-primary rounded-md hover:bg-primary/5 transition-colors"
              >
                Browse Courses
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
