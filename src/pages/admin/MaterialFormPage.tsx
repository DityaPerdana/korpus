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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Material = Tables<"materials">;
type Module = Tables<"modules">;

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  content_type: z.enum(["text", "video", "pdf", "link"]),
  content: z.string().optional(),
  file_url: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .optional()
    .or(z.literal("")),
  position: z.number().int().min(1, { message: "Position must be at least 1" }),
});

type FormValues = z.infer<typeof formSchema>;

const MaterialFormPage = () => {
  const { id, moduleId } = useParams<{ id: string; moduleId: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(isEditing || !!moduleId);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content_type: "text",
      content: "",
      file_url: "",
      position: 1,
    },
  });

  const contentType = form.watch("content_type");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // If editing, fetch material data
        if (isEditing) {
          const { data: materialData, error: materialError } = await supabase
            .from("materials")
            .select("*, modules(*)")
            .eq("id", id)
            .single();

          if (materialError) throw materialError;

          if (materialData) {
            form.reset({
              title: materialData.title,
              content_type: materialData.content_type || "text",
              content: materialData.content || "",
              file_url: materialData.file_url || "",
              position: materialData.position,
            });

            // Set module from the joined data
            if (materialData.modules) {
              setModule(materialData.modules as Module);
            }
          }
        }
        // If creating a new material for a module, fetch module data
        else if (moduleId) {
          const { data: moduleData, error: moduleError } = await supabase
            .from("modules")
            .select("*")
            .eq("id", moduleId)
            .single();

          if (moduleError) throw moduleError;
          setModule(moduleData);

          // Get the highest position number for existing materials in this module
          const { data: materialsData, error: materialsError } = await supabase
            .from("materials")
            .select("position")
            .eq("module_id", moduleId)
            .order("position", { ascending: false })
            .limit(1);

          if (materialsError) throw materialsError;

          // Set position to be one more than the highest existing position, or 1 if no materials exist
          const nextPosition =
            materialsData && materialsData.length > 0
              ? materialsData[0].position + 1
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
  }, [id, moduleId, isEditing, form]);

  const onSubmit = async (values: FormValues) => {
    if (!module && !isEditing) {
      setError("Module information is missing");
      return;
    }

    try {
      setSaveLoading(true);
      setError(null);

      // Validate based on content type
      if (values.content_type === "text" && !values.content) {
        setError("Content is required for text materials");
        setSaveLoading(false);
        return;
      }

      if (
        (values.content_type === "video" ||
          values.content_type === "pdf" ||
          values.content_type === "link") &&
        !values.file_url
      ) {
        setError(`URL is required for ${values.content_type} materials`);
        setSaveLoading(false);
        return;
      }

      if (isEditing) {
        // Update existing material
        const { error } = await supabase
          .from("materials")
          .update({
            title: values.title,
            content_type: values.content_type,
            content: values.content_type === "text" ? values.content : null,
            file_url: ["video", "pdf", "link"].includes(values.content_type)
              ? values.file_url
              : null,
            position: values.position,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id);

        if (error) throw error;

        // Navigate back to module detail page
        if (module) {
          navigate(`/admin/modules/${module.id}`);
        } else {
          navigate("/admin/modules");
        }
      } else {
        // Create new material
        const { error } = await supabase.from("materials").insert({
          title: values.title,
          content_type: values.content_type,
          content: values.content_type === "text" ? values.content : null,
          file_url: ["video", "pdf", "link"].includes(values.content_type)
            ? values.file_url
            : null,
          position: values.position,
          module_id: moduleId,
          created_at: new Date().toISOString(),
        });

        if (error) throw error;
        navigate(`/admin/modules/${moduleId}`);
      }
    } catch (err) {
      console.error("Error saving material:", err);
      setError("Failed to save material. Please try again.");
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
            if (isEditing && module) {
              navigate(`/admin/modules/${module.id}`);
            } else if (moduleId) {
              navigate(`/admin/modules/${moduleId}`);
            } else {
              navigate("/admin/modules");
            }
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <h1 className="text-3xl font-bold mb-6">
          {isEditing ? "Edit Material" : "Create New Material"}
          {module && ` for ${module.title}`}
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
                        <FormLabel>Material Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Introduction to the Topic"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The name of this learning material as it will appear
                          to students.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select content type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="pdf">PDF Document</SelectItem>
                            <SelectItem value="link">External Link</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The type of content for this learning material.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {contentType === "text" && (
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter the text content here..."
                              className="min-h-[300px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            The text content of this learning material.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {["video", "pdf", "link"].includes(contentType) && (
                    <FormField
                      control={form.control}
                      name="file_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {contentType === "video"
                              ? "Video URL"
                              : contentType === "pdf"
                                ? "PDF URL"
                                : "External Link URL"}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={`Enter the ${contentType} URL here...`}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {contentType === "video"
                              ? "URL to the video (YouTube, Vimeo, etc.)"
                              : contentType === "pdf"
                                ? "URL to the PDF document"
                                : "URL to the external resource"}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

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
                          The order in which this material appears in the module
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
                          {isEditing ? "Update Material" : "Create Material"}
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

export default MaterialFormPage;
