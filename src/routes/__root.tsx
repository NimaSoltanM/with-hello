import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "سامانه بازخورد" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootDocument,
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-6">
          <div className="flex items-center gap-2 text-blue-600">
            <MessageSquare size={20} strokeWidth={2} />
            <span className="text-base font-bold text-gray-800">
              سامانه بازخورد
            </span>
          </div>
          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              activeProps={{
                className:
                  "px-3 py-1.5 rounded-lg text-sm bg-blue-50 text-blue-700 font-medium",
              }}
              activeOptions={{ exact: true }}
            >
              ارسال بازخورد
            </Link>
            <Link
              to="/admin"
              className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              activeProps={{
                className:
                  "px-3 py-1.5 rounded-lg text-sm bg-blue-50 text-blue-700 font-medium",
              }}
            >
              داشبورد ادمین
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
