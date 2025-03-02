import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/types/supabase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Module = Tables<"modules">;
type Course = Tables<"courses">;

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  position: z.number().int().min(1, { message: "Position must be at least 1" }),
});

type FormValues = z.infer<typeof formSchema>;

const ModuleFormPage = () => {
  const { id, courseId } = useParams<{ id: string; courseId: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(isEditing || !!courseId);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      position: 1,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // If editing, fetch module data
        if (isEditing) {
          const { data: moduleData, error: moduleError } = await supabase
            .from("modules")
            .select("*, courses(*)")
            .eq("id", id)
            .single();

          if (moduleError) throw moduleError;

          if (moduleData) {
            form.reset({
              title: moduleData.title,
              description: moduleData.description || "",
              position: moduleData.position,
            });

            // Set course from the joined data
            if (moduleData.courses) {
              setCourse(moduleData.courses as Course);
            }
          }
        }
        // If creating a new module for a course, fetch course data
        else if (courseId) {
          const { data: courseData, error: courseError } = await supabase
            .from("courses")
            .select("*")
            .eq("id", courseId)
            .single();

          if (courseError) throw courseError;
          setCourse(courseData);

          // Get the highest position number for existing modules in this course
          const { data: modulesData, error: modulesError } = await supabase
            .from("modules")
            .select("position")
            .eq("course_id", courseId)
            .order("position", { ascending: false })
            .limit(1);

          if (modulesError) throw modulesError;

          // Set position to be one more than the highest existing position, or 1 if no modules exist
          const nextPosition =
            modulesData && modulesData.length > 0
              ? modulesData[0].position + 1
              : 1;
          form.setValue("position", nextPosition);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, courseId, isEditing, form]);

  const onSubmit = async (values: FormValues) => {
    if (!course && !isEditing) {
      setError("Course information is missing");
      return;
    }

    try {
      setSaveLoading(true);
      setError(null);

      if (isEditing) {
        // Update existing module
        const { error } = await supabase
          .from("modules")
          .update({
            title: values.title,
            description: values.description,
            position: values.position,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id);

        if (error) throw error;

        // Navigate back to course detail page
        if (course) {
          navigate(`/admin/courses/${course.id}`);
        } else {
          navigate("/admin/modules");
        }
      } else {
        // Create new module
        const { error } = await supabase.from("modules").insert({
          title: values.title,
          description: values.description,
          position: values.position,
          course_id: courseId,
          created_at: new Date().toISOString(),
        });

        if (error) throw error;
        navigate(`/admin/courses/${courseId}`);
      }
    } catch (err) {
      console.error("Error saving module:", err);
      setError("Failed to save module. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => {
            if (isEditing && course) {
              navigate(`/admin/courses/${course.id}`);
            } else if (courseId) {
              navigate(`/admin/courses/${courseId}`);
            } else {
              navigate("/admin/modules");
            }
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <h1 className="text-3xl font-bold mb-6">
          {isEditing ? "Edit Module" : "Create New Module"}
          {course && ` for ${course.title}`}
        </h1>

        {error && (
          <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Module Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Introduction to the Course"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The name of this module as it will appear to students.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide a description of what students will learn in this module..."
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A brief overview of the module content.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 1)
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          The order in which this module appears in the course
                          (1 is first).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={saveLoading}>
                      {saveLoading ? (
                        <>
                          <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          {isEditing ? "Update Module" : "Create Module"}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ModuleFormPage;
