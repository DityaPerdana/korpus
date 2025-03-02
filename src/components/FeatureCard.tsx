import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface FeatureCardProps {
  icon?: React.ElementType;
  title?: string;
  description?: string;
  className?: string;
}

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
          {Icon && <Icon className="h-8 w-8 text-primary" />}
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

export default FeatureCard;
