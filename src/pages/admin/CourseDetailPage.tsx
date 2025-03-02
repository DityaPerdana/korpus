import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Edit,
  PlusCircle,
  BookOpen,
  FileText,
  ListChecks,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/types/supabase";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type Course = Tables<"courses">;
type Module = Tables<"modules">;

const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // Fetch course details
        const { data: courseData, error: courseError } = await supabase
          .from("courses")
          .select("*")
          .eq("id", id)
          .single();

        if (courseError) throw courseError;
        setCourse(courseData);

        // Fetch modules for this course
        const { data: modulesData, error: modulesError } = await supabase
          .from("modules")
          .select("*")
          .eq("course_id", id)
          .order("position", { ascending: true });

        if (modulesError) throw modulesError;
        setModules(modulesData || []);
      } catch (err) {
        console.error("Error fetching course data:", err);
        setError("Failed to load course data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/admin/courses")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
          </Button>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h3 className="text-xl font-semibold mb-2">Error</h3>
              <p className="text-muted-foreground mb-6">
                {error || "Course not found"}
              </p>
              <Button onClick={() => navigate("/admin/courses")}>
                Return to Course List
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/admin/courses")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
        </Button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <div className="flex items-center mt-2">
              <Badge
                variant={course.is_published ? "default" : "outline"}
                className="mr-2"
              >
                {course.is_published ? "Published" : "Draft"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Created: {new Date(course.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/admin/courses/${id}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" /> Edit Course
            </Button>
            <Button
              onClick={() => navigate(`/admin/courses/${id}/modules/new`)}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Module
            </Button>
          </div>
        </div>

        {course.cover_image && (
          <div
            className="w-full h-64 bg-cover bg-center rounded-lg mb-6"
            style={{ backgroundImage: `url(${course.cover_image})` }}
          />
        )}

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground whitespace-pre-line">
              {course.description || "No description provided"}
            </p>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Course Modules</h2>
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/courses/${id}/modules/new`)}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Module
          </Button>
        </div>

        {modules.length === 0 ? (
          <Card className="bg-muted/40">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No modules yet</h3>
              <p className="text-muted-foreground mb-6">
                Start building your course by adding modules
              </p>
              <Button
                onClick={() => navigate(`/admin/courses/${id}/modules/new`)}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Create First Module
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {modules.map((module, index) => (
              <Card
                key={module.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div className="bg-primary/10 text-primary font-medium rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        {index + 1}
                      </div>
                      <CardTitle>{module.title}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/admin/modules/${module.id}`)}
                      >
                        <ListChecks className="h-4 w-4 mr-1" /> Materials
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigate(`/admin/modules/${module.id}/quiz`)
                        }
                      >
                        <FileText className="h-4 w-4 mr-1" /> Quiz
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(`/admin/modules/${module.id}/edit`)
                        }
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {module.description || "No description provided"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Separator className="my-8" />

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Final Exam</h2>
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/courses/${id}/exam`)}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Manage Final Exam
          </Button>
        </div>

        <Card className="bg-muted/40">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Final Exam</h3>
            <p className="text-muted-foreground mb-6">
              Create a comprehensive final exam for this course
            </p>
            <Button onClick={() => navigate(`/admin/courses/${id}/exam`)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Set Up Final Exam
            </Button>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetailPage;
