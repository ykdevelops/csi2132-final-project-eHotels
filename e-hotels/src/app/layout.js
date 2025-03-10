import Navbar from "@/components/Navbar";
import { UserProvider } from "@/context/UserContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Wrap your entire app in the UserProvider */}
        <UserProvider>
          <Navbar />
          <main>{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}
