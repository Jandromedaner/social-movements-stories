import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const AboutPage = () => {
  return (
    <div className="min-h-screen f  lex flex-col bg-gradient-to-b from-blue-500 to-purple-600 text-white p-8">
      <nav className="mb-8">
        <Link href="/" passHref>
          <Button variant="ghost" className="text-white hover:text-blue-200">
            Back to Home
          </Button>
        </Link>
      </nav>

      <main className="flex-grow">
        <h1 className="text-4xl font-bold mb-6">
          About Civil Rights Milestones
        </h1>
        <p className="text-xl mb-4">
          Civil Rights Milestones is an interactive project that aims to educate
          and inform about significant events in the global history of civil
          rights movements.
        </p>
        <p className="text-xl mb-4">
          Our interactive globe allows users to explore key moments and figures
          in civil rights history from around the world, providing context and
          information about these crucial events.
        </p>
        <p className="text-xl">
          We believe that understanding our shared history of struggle for
          equality and justice is crucial for building a better future for all.
        </p>
      </main>
    </div>
  );
};

export default AboutPage;
