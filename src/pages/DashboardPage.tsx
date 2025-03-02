import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-4">
                Welcome to your Dashboard
              </h1>
              <p className="text-gray-600">
                Hello, {user?.user_metadata?.full_name || user?.email}
              </p>
            </div>
            {/* Admin button - in a real app, you'd check for admin role */}
            <Button onClick={() => navigate("/admin")}>Admin Dashboard</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">My Courses</h2>
            <p className="text-gray-600">
              You haven't enrolled in any courses yet.
            </p>
            <button className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
              Browse Courses
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <p className="text-gray-600">No recent activity to display.</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Deadlines</h2>
            <p className="text-gray-600">No upcoming deadlines.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
