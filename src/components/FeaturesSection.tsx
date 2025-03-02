import React from "react";
import { BookOpen, CheckCircle, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface FeatureCardProps {
  icon?: React.ElementType;
  title?: string;
  description?: string;
  className?: string;
}

// Internal FeatureCard component since we can't import from ./FeatureCard
const FeatureCard = ({
  icon: Icon = BookOpen,
  title = "Course Modules",
  description = "Access comprehensive learning modules designed to enhance your educational journey.",
  className = "",
}: FeatureCardProps) => {
  return (
    <Card
      className={`w-full max-w-[350px] h-[400px] bg-white transition-all duration-300 hover:shadow-lg ${className}`}
    >
      <CardHeader className="flex items-center justify-center pt-8">
        <div className="p-4 rounded-full bg-primary/10 mb-4">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-xl text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-center text-base">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

interface FeaturesSectionProps {
  title?: string;
  subtitle?: string;
  features?: Array<{
    icon: React.ElementType;
    title: string;
    description: string;
  }>;
}

const FeaturesSection = ({
  title = "Platform Features",
  subtitle = "Discover the powerful tools that make learning effective and engaging",
  features = [
    {
      icon: BookOpen,
      title: "Course Modules",
      description:
        "Access comprehensive learning modules designed to enhance your educational journey.",
    },
    {
      icon: CheckCircle,
      title: "Interactive Quizzes",
      description:
        "Test your knowledge with our interactive quizzes designed to reinforce learning concepts.",
    },
    {
      icon: FileText,
      title: "Assignments",
      description:
        "Complete practical assignments that help apply theoretical knowledge to real-world scenarios.",
    },
  ],
}: FeaturesSectionProps) => {
  return (
    <section className="w-full py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              className="hover:translate-y-[-8px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
