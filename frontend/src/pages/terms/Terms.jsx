import React from "react";
import Container from "../../components/Container";

const Terms = () => {
  return (
    <Container>
      <div className="max-w-3xl mx-auto py-10 space-y-6">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
        <p className="text-sm opacity-60">Last Updated: October 2025</p>
        
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p className="opacity-80">By accessing and using Docs Mini, you accept and agree to be bound by the terms and provision of this agreement.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. User Responsibilities</h2>
          <p className="opacity-80">You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. Prohibited Content</h2>
          <p className="opacity-80">You may not upload violent, illegal, or malicious content. We reserve the right to remove any document that violates these policies and ban the offending user.</p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-2">4. Termination</h2>
          <p className="opacity-80">We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever.</p>
        </section>
      </div>
    </Container>
  );
};

export default Terms;