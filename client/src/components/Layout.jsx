import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>

      {/* Footer will come here */}
    </div>
  );
}

export default Layout;