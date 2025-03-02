import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface TestimonialProps {
  name?: string;
  role?: string;
  content?: string;
  rating?: number;
  avatarUrl?: string;
}

const TestimonialCard = ({
  name = "Sarah Johnson",
  role = "Computer Science Student",
  content = "Corvus LMS has transformed my learning experience. The interactive modules and quizzes have helped me grasp complex concepts more easily.",
  rating = 5,
  avatarUrl = "",
}: TestimonialProps) => {
  return (
    <Card className="w-full max-w-[350px] h-[300px] bg-white shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-12 w-12">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={name} />
          ) : (
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
              alt={name}
            />
          )}
          <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg">{name}</CardTitle>
          <CardDescription>{role}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600 line-clamp-5">{content}</p>
      </CardContent>
    </Card>
  );
};

interface TestimonialsSectionProps {
  testimonials?: TestimonialProps[];
  title?: string;
  subtitle?: string;
}

const TestimonialsSection = ({
  testimonials = [
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
  ],
  title = "What Our Students Say",
  subtitle = "Hear from learners who have transformed their educational journey with Corvus LMS",
}: TestimonialsSectionProps) => {
  return (
    <section className="w-full py-16 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
