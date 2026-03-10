import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (

    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <Navbar />

        {/* Content */}
        <main className="flex-1 p-8 overflow-y-auto">

          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-md p-6 border border-white/40">

            {children}

          </div>

        </main>

      </div>

    </div>

  );
};

export default DashboardLayout;