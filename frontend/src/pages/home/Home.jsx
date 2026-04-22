import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/Container";
import { ThemeContext } from "../../contexts/ThemeContext";

const Home = () => {
  const { theme } = useContext(ThemeContext);

  const features = [
    { title: "Secure Storage", icon: "🔒", desc: "Your documents are encrypted and protected with industry-standard security." },
    { title: "Anywhere Access", icon: "☁️", desc: "Access your files from any device, anytime, anywhere in the world." },
    { title: "Public Sharing", icon: "🌍", desc: "Share documents publicly with a single click, managed by our moderators." },
  ];

  return (
    <div className={`min-h-[calc(100vh-140px)] ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
      
      {/* Hero Section */}
      <section className="py-20 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Manage your docs <br />
            <span className="bg-gradient-to-r from-green-500 to-emerald-700 bg-clip-text text-transparent">
              without the chaos.
            </span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            DOCS MINI is the simplest way to upload, organize, and share your important documents. Secure by design, easy by nature.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/auth" className="px-8 py-4 bg-green-600 text-white rounded-full text-lg font-bold hover:bg-green-700 shadow-lg hover:shadow-green-500/30 transition-all transform hover:-translate-y-1">
              Get Started for Free
            </Link>
            <Link to="/about" className={`px-8 py-4 rounded-full text-lg font-bold border transition-all ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-100'}`}>
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-zinc-800/50' : 'bg-gray-50'}`}>
        <Container>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className={`p-8 rounded-2xl ${theme === 'dark' ? 'bg-zinc-900' : 'bg-white'} shadow-xl hover:shadow-2xl transition-shadow`}>
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;