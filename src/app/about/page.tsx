import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">About Music Generator</h1>

                <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <p className="text-lg">
                        Our Music Generator uses advanced AI technology to create beautiful piano instrumentals.
                        Whether you want to generate original melodies or recreate your favorite songs, our tool
                        provides high-quality musical output for your creative projects.
                    </p>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">How It Works</h2>

                    <p>
                        The music generation process involves several steps:
                    </p>

                    <ol className="list-decimal pl-6 space-y-2 my-4">
                        <li>
                            <strong>Input Processing</strong>: We analyze your song name (if provided) and additional instructions.
                        </li>
                        <li>
                            <strong>AI Generation</strong>: Our AI model creates a structured representation of musical notes,
                            including pitch, timing, duration, and velocity.
                        </li>
                        <li>
                            <strong>MIDI Conversion</strong>: The generated notes are converted into a standard MIDI file format.
                        </li>
                        <li>
                            <strong>Download</strong>: The MIDI file is made available for download, ready to use in your favorite
                            music software.
                        </li>
                    </ol>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">Current Features</h2>

                    <ul className="list-disc pl-6 space-y-2 my-4">
                        <li>Piano instrumental generation</li>
                        <li>Song recreation based on title input</li>
                        <li>Customization through additional instructions</li>
                        <li>MIDI file output compatible with most music software</li>
                    </ul>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">Future Plans</h2>

                    <p>
                        We're constantly working to improve our music generation capabilities.
                        Future updates may include:
                    </p>

                    <ul className="list-disc pl-6 space-y-2 my-4">
                        <li>Support for additional instruments beyond piano</li>
                        <li>More detailed customization options</li>
                        <li>Direct audio playback in the browser</li>
                        <li>Collaborative features for sharing and remixing</li>
                    </ul>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">Technology</h2>

                    <p>
                        Our music generator is built using:
                    </p>

                    <ul className="list-disc pl-6 space-y-2 my-4">
                        <li>Next.js for the web application framework</li>
                        <li>AI language models for music generation</li>
                        <li>Tone.js MIDI library for music file handling</li>
                        <li>Tailwind CSS for the user interface</li>
                    </ul>
                </div>

                <div className="mt-12 flex justify-center">
                    <Link
                        href="/"
                        className="text-sm text-muted-foreground hover:underline mr-6"
                    >
                        ← Back to Home
                    </Link>
                    <Link
                        href="/generate"
                        className="text-sm text-primary hover:underline"
                    >
                        Try Generating Music →
                    </Link>
                </div>
            </div>
        </div>
    );
}