import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-4 sm:p-8 lg:p-16 gap-12 font-[family-name:var(--font-geist-sans)] bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex flex-col gap-10 row-start-2 items-center text-center max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="relative">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600 dark:from-indigo-400 dark:to-pink-400 animate-fade-in">
            Music Instrumental Generator
          </h1>
          <p className="mt-4 text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl animate-fade-in-up">
            Create stunning piano instrumentals with AI. Craft original melodies or reimagine your favorite songs.
          </p>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link
            href="/dashboard"
            className="group relative rounded-full bg-indigo-600 text-white font-semibold text-sm sm:text-base h-12 px-6 flex items-center justify-center transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-500"
            aria-label="Generate music with AI"
          >
            <span className="relative z-10">Generate Music</span>
            <span className="absolute inset-0 rounded-full bg-indigo-800 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 w-full">
          {[
            {
              title: "Piano Melodies",
              description: "Generate beautiful piano compositions with our AI technology.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M9 18V5l12-2v13"></path>
                  <circle cx="6" cy="18" r="3"></circle>
                  <circle cx="18" cy="16" r="3"></circle>
                </svg>
              ),
            },
            {
              title: "Customization",
              description: "Adjust parameters to create the perfect sound for your project.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M12 18V6"></path>
                  <path d="M8 18V8"></path>
                  <path d="M16 18V12"></path>
                  <path d="M2 8h20"></path>
                  <path d="M2 12h20"></path>
                  <path d="M2 16h20"></path>
                </svg>
              ),
            },
            {
              title: "Song Recreation",
              description: "Recreate your favorite songs with our AI-powered music generator.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </svg>
              ),
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-gray-600 dark:text-gray-400">
        {["About", "Generate", "Dashboard"].map((link, index) => (
          <Link
            key={index}
            href={`/${link.toLowerCase()}`}
            className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 hover:underline underline-offset-4"
            aria-label={`Go to ${link} page`}
          >
            {link}
          </Link>
        ))}
      </footer>
    </div>
  );
}