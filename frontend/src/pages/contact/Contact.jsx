import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Container from "../../components/Container";
import { ThemeContext } from "../../contexts/ThemeContext";
import ComplaintForm from "./parts/ComplaintForm";

const Contact = () => {
  const { theme } = useContext(ThemeContext);
  const { status } = useSelector((state) => state.auth);

  return (
    <Container>
      <div className="max-w-6xl mx-auto py-16 px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black tracking-tighter dark:text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-zinc-500 font-medium max-w-xl mx-auto">
            Have a question about your documents or need technical support? 
            Our regional offices are here to help 24/7.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Info Section */}
          <div className="space-y-8">
            <ContactCard 
              icon="📍" 
              title="Headquarters" 
              detail="Chhatrapati Sambhajinagar, MH, India" 
            />
            <ContactCard 
              icon="📧" 
              title="Email Support" 
              detail="support@docsmini.com" 
            />
            <ContactCard 
              icon="📞" 
              title="Phone" 
              detail="+91 1234567890" 
            />
          </div>

          {/* Form Section (Conditional) */}
          <div className="lg:col-span-2">
            {status ? (
              <div className="bg-white dark:bg-zinc-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-zinc-700">
                <div className="mb-6">
                    <h2 className="text-2xl font-black dark:text-white">Raise a Ticket</h2>
                    <p className="text-xs text-green-600 font-bold uppercase tracking-widest mt-1">Direct Support Line</p>
                </div>
                <ComplaintForm />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-800/40 p-12 rounded-[2.5rem] border-2 border-dashed border-zinc-200 dark:border-zinc-700 text-center">
                <span className="text-5xl mb-6">🔒</span>
                <h3 className="text-xl font-bold dark:text-white mb-2">Secure Support Portal</h3>
                <p className="text-zinc-500 text-sm mb-8 max-w-xs">
                  To protect your data and verify your identity, support tickets can only be raised by registered members.
                </p>
                <Link to="/auth" className="btn-primary px-10 py-3 rounded-2xl text-xs font-black tracking-widest uppercase">
                  Sign In to Contact Us
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

const ContactCard = ({ icon, title, detail }) => (
  <div className="p-6 bg-white dark:bg-zinc-800 rounded-3xl border border-gray-100 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow">
    <span className="text-3xl mb-4 block">{icon}</span>
    <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-1">{title}</h4>
    <p className="font-bold dark:text-white text-sm">{detail}</p>
  </div>
);

export default Contact;