// File: app/admin/layout.tsx
import AdminSidebarClient from "../../components/AdminSidebarClient";



type Props = {
  children: React.ReactNode;
};


export default async function AdminLayout({ children }: Props) {
  
  return (
      
      <div className="min-h-screen flex bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <AdminSidebarClient />
        {/* added ml:64 to compensate with sidebar width */}
        <div className="flex-1 flex flex-col min-h-0 md:ml-64">
          <main className="flex-1 overflow-auto pt-16 md:pt-0">
            {children}
          </main>
          <footer className="flex-shrink-0 text-center border-t p-2  border-secondary-200 dark:border-secondary-700">
            {/* <Footer /> */}
            <br></br>
            <span>&copy; 2025 StackHook Pvt. Ltd.</span>
            <span className="hidden sm:inline">|</span>
            <span>All Rights Reserved</span>
          </footer>
        </div>
      </div>

  );
}