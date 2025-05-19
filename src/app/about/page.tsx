import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8 lg:p-12 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600 dark:from-indigo-400 dark:to-pink-400">
                        About Music Generator
                    </h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                        Discover how our AI-powered tool creates stunning instrumental melodies.
                    </p>
                </div>

                {/* Main Content */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-sm animate-fade-in-up">
                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <p className="text-lg text-gray-700 dark:text-gray-300">
                            Our Music Generator leverages advanced AI technology to craft beautiful instrumentals. Whether you’re creating original melodies or recreating your favorite songs, our tool delivers high-quality musical output for your creative projects.
                        </p>

                        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">
                            How It Works
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            The music generation process involves several steps:
                        </p>
                        <ol className="list-decimal pl-6 space-y-3 my-4 text-gray-600 dark:text-gray-400">
                            {[
                                {
                                    title: 'Input Processing',
                                    description: 'We analyze your song name (if provided) and additional instructions.',
                                },
                                {
                                    title: 'AI Generation',
                                    description: 'Our AI model creates a structured representation of musical notes, including pitch, timing, duration, and velocity.',
                                },
                                {
                                    title: 'MIDI Conversion',
                                    description: 'The generated notes are converted into a standard MIDI file format.',
                                },
                                {
                                    title: 'Download',
                                    description: 'The MIDI file is made available for download, ready to use in your favorite music software.',
                                },
                            ].map((step, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <svg
                                        className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mt-0.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 18V5l12-2v13M6 18a3 3 0 100-6 3 3 0 000 6zm12-2a3 3 0 100-6 3 3 0 000 6z"
                                        ></path>
                                    </svg>
                                    <div>
                                        <strong className="text-gray-900 dark:text-gray-100">{step.title}</strong>: {step.description}
                                    </div>
                                </li>
                            ))}
                        </ol>

                        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">
                            Current Features
                        </h2>
                        <ul className="list-none pl-0 space-y-3 my-4 text-gray-600 dark:text-gray-400">
                            {[
                                'Instrumental generation',
                                'Song recreation based on title input',
                                'Customization through additional instructions',
                                'MIDI file output compatible with most music software',
                            ].map((feature, index) => (
                                <li key={index} className="flex items-center gap-3">
                                    <svg
                                        className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 13l4 4L19 7"
                                        ></path>
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">
                            Future Plans
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            We’re constantly working to improve our music generation capabilities. Future updates may include:
                        </p>
                        <ul className="list-none pl-0 space-y-3 my-4 text-gray-600 dark:text-gray-400">
                            {[
                                'Support for additional instruments beyond piano',
                                'More detailed customization options',
                                'Direct audio playback in the browser',
                                'Collaborative features for sharing and remixing',
                            ].map((plan, index) => (
                                <li key={index} className="flex items-center gap-3">
                                    <svg
                                        className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                    {plan}
                                </li>
                            ))}
                        </ul>

                        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">
                            Technology
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Our music generator is built using:
                        </p>
                        <ul className="list-none pl-0 space-y-3 my-4 text-gray-600 dark:text-gray-400">
                            {[
                                'Next.js for the web application framework',
                                'AI language models for music generation',
                                'Tone.js MIDI library for music file handling',
                                'Tailwind CSS for the user interface',
                            ].map((tech, index) => (
                                <li key={index} className="flex items-center gap-3">
                                    <svg
                                        className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                                        ></path>
                                    </svg>
                                    {tech}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="mt-12 flex justify-center gap-6 animate-fade-in-up">
                    <Link
                        href="/"
                        className="py-2 px-4 text-indigo-600 dark:text-indigo-400 font-medium hover:underline underline-offset-4 transition-all duration-200 focus:ring-2 focus:ring-indigo-300"
                        aria-label="Back to home"
                    >
                        ← Back to Home
                    </Link>
                    <Link
                        href="/generate"
                        className="py-2 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300 transition-all duration-200"
                        aria-label="Try generating music"
                    >
                        Try Generating Music →
                    </Link>
                </div>
            </div>
        </div>
    );
}
