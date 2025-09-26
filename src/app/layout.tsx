// src/app/layout.tsx
import '@mantine/core/styles.css';
import "./globals.css"
import Navbar from "@/components/Navbar"

export const metadata = {
  title: "DGCA Admin",
  description: "Admin dashboard for managing notes",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
