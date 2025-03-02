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
  FileText,
  Trash2,
  GripVertical,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/types/supabase";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type Module = Tables<"modules">;
type Course = Tables<"courses">;
type Material = Tables<"materials">;

const ModuleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [module, setModule] = useState<Module | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModuleData = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // Fetch module details with course
        const { data: moduleData, error: moduleError } = await supabase
          .from("modules")
          .select("*, courses(*)")
          .eq("id", id)
          .single();

        if (moduleError) throw moduleError;
        setModule(moduleData);
        setCourse(moduleData.courses as Course);

        // Fetch materials for this module
        const { data: materialsData, error: materialsError } = await supabase
          .from("materials")
          .select("*")
          .eq("module_id", id)
          .order("position", { ascending: true });

        if (materialsError) throw materialsError;
        setMaterials(materialsData || []);
      } catch (err) {
        console.error("Error fetching module data:", err);
        setError("Failed to load module data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchModuleData();
  }, [id]);

  const handleDeleteMaterial = async (materialId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this material? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("materials")
        .delete()
        .eq("id", materialId);

      if (error) throw error;
      setMaterials(materials.filter((material) => material.id !== materialId));
    } catch (err) {
      console.error("Error deleting material:", err);
      setError("Failed to delete material. Please try again.");
    }
  };

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

  if (error || !module || !course) {
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
                {error || "Module not found"}
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
          onClick={() => navigate(`/admin/courses/${course.id}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to {course.title}
        </Button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center">
              <Badge variant="outline" className="mr-3">
                Module {module.position}
              </Badge>
              <h1 className="text-3xl font-bold">{module.title}</h1>
            </div>
            <p className="text-muted-foreground mt-2">
              Part of course: {course.title}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/admin/modules/${id}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" /> Edit Module
            </Button>
            <Button
              onClick={() => navigate(`/admin/modules/${id}/materials/new`)}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Material
            </Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground whitespace-pre-line">
              {module.description || "No description provided"}
            </p>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Learning Materials</h2>
          <Button
            onClick={() => navigate(`/admin/modules/${id}/materials/new`)}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Material
          </Button>
        </div>

        {materials.length === 0 ? (
          <Card className="bg-muted/40">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No materials yet</h3>
              <p className="text-muted-foreground mb-6">
                Add learning materials to this module
              </p>
              <Button
                onClick={() => navigate(`/admin/modules/${id}/materials/new`)}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add First Material
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {materials.map((material, index) => (
              <Card
                key={material.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div className="bg-primary/10 text-primary font-medium rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        {material.position}
                      </div>
                      <div>
                        <CardTitle className="flex items-center">
                          {material.title}
                          <Badge variant="outline" className="ml-3">
                            {material.content_type || "Text"}
                          </Badge>
                        </CardTitle>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigate(`/admin/materials/${material.id}`)
                        }
                      >
                        <FileText className="h-4 w-4 mr-1" /> View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(`/admin/materials/${material.id}/edit`)
                        }
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteMaterial(material.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2">
                    {material.content
                      ? material.content.substring(0, 150) +
                        (material.content.length > 150 ? "..." : "")
                      : material.file_url
                        ? "External resource"
                        : "No content preview available"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Separator className="my-8" />

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Module Quiz</h2>
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/modules/${id}/quiz`)}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Manage Quiz
          </Button>
        </div>

        <Card className="bg-muted/40">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Module Quiz</h3>
            <p className="text-muted-foreground mb-6">
              Create a quiz to test knowledge from this module
            </p>
            <Button onClick={() => navigate(`/admin/modules/${id}/quiz`)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Set Up Quiz
            </Button>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default ModuleDetailPage;
