// File: app/admin/layout.tsx
import Link from "next/link";
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
            <footer className="flex-shrink-0 border-t border-secondary-200/60 dark:border-secondary-800 bg-secondary-50/30 dark:bg-secondary-950/20 py-3 px-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-[11px] font-medium tracking-wide text-secondary-400 dark:text-secondary-500">
              <span>&copy; {new Date().getFullYear()} <Link href="https://stackhook.io" target="blank">StackHook Pvt. Ltd.</Link></span>
              <span className="hidden sm:inline text-secondary-200 dark:text-secondary-800">|</span>
              <span>All Rights Reserved</span>
            </div>
          </footer>
        </div>
      </div>

  );
}