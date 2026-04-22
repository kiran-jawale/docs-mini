import React from "react";
import Container from "../../components/Container";

const About = () => {
  return (
    <Container>
      <div className="max-w-3xl mx-auto py-12">
        <h1 className="text-4xl font-bold mb-6 text-green-600">About Docs Mini</h1>
        
        <div className="space-y-6 text-lg leading-relaxed opacity-90">
          <p>
            Welcome to <strong>Docs Mini</strong>, a project born from the necessity of simplicity. In a world cluttered with complex file management systems, we aimed to build something that just works.
          </p>
          
          <p>
            Our mission is to provide a robust, secure, and intuitive platform for individuals to manage their digital lives. Whether you are storing personal receipts, sharing project proposals, or archiving academic papers, Docs Mini serves as your reliable digital vault.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Our Core Values</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Security First:</strong> We utilize advanced encryption and strict role-based access control to ensure your data stays yours.</li>
            <li><strong>Transparency:</strong> Our moderation policies for public documents are clear and fair.</li>
            <li><strong>Speed:</strong> A lightning-fast interface powered by modern web technologies.</li>
          </ul>

          <div className="mt-12 p-6 bg-green-50 dark:bg-zinc-800 rounded-xl border-l-4 border-green-500">
            <p className="italic text-base">
              "Technology should be an enabler, not a hurdle. Docs Mini is our attempt to remove the hurdles from document management."
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default About;