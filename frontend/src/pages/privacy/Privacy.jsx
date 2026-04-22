import React from "react";
import Container from "../../components/Container";

const Privacy = () => {
  return (
    <Container>
      <div className="max-w-3xl mx-auto py-10 space-y-6">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <section>
          <h2 className="text-xl font-semibold mb-2">Data Collection</h2>
          <p className="opacity-80">We collect information you provide directly to us, such as when you create or modify your account, upload documents, or contact customer support.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">How We Use Your Data</h2>
          <p className="opacity-80">We use the information we collect to operate, maintain, and provide the features of Docs Mini. We do not sell your personal data to third parties.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Document Security</h2>
          <p className="opacity-80">Your files are stored using industry-standard encryption. Access is restricted based on the permissions you set (Private or Public).</p>
        </section>
      </div>
    </Container>
  );
};

export default Privacy;