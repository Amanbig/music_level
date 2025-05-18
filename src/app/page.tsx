import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center text-center max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Music Instrumental Generator</h1>
        <p className="text-xl text-muted-foreground">
          Create beautiful piano instrumentals with AI. Generate original melodies or recreate your favorite songs.
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row mt-4">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/generate"
          >
            Generate Music
          </Link>
          <Link
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
            href="/dashboard"
          >
            My Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 w-full">
          <div className="flex flex-col items-center p-6 border rounded-lg">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Piano Melodies</h3>
            <p className="text-center text-muted-foreground">Generate beautiful piano compositions with our AI technology.</p>
          </div>

          <div className="flex flex-col items-center p-6 border rounded-lg">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
                <path d="M12 18V6"></path>
                <path d="M8 18V8"></path>
                <path d="M16 18V12"></path>
                <path d="M2 8h20"></path>
                <path d="M2 12h20"></path>
                <path d="M2 16h20"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Customization</h3>
            <p className="text-center text-muted-foreground">Adjust parameters to create the perfect sound for your project.</p>
          </div>

          <div className="flex flex-col items-center p-6 border rounded-lg">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Song Recreation</h3>
            <p className="text-center text-muted-foreground">Recreate your favorite songs with our AI-powered music generator.</p>
          </div>
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/about"
        >
          About
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/generate"
        >
          Generate
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/dashboard"
        >
          Dashboard
        </Link>
      </footer>
    </div>
  );
}
