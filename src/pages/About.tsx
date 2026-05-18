import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, ShieldCheck, Target, Mail } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';

const About: React.FC = () => {
  const stats = [
    { label: 'Properties Listed', value: '20K+' },
    { label: 'Happy Customers', value: '15K+' },
    { label: 'Cities Covered', value: '50+' },
    { label: 'Years of Experience', value: '10+' },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: 'Trust & Transparency',
      description: 'We believe in complete transparency in every transaction, ensuring peace of mind for buyers and sellers alike.',
    },
    {
      icon: Users,
      title: 'Client-Centric Approach',
      description: 'Our clients are at the heart of everything we do. We strive to exceed expectations and deliver exceptional service.',
    },
    {
      icon: Target,
      title: 'Innovation Driven',
      description: 'Leveraging cutting-edge technology to make property search, buying, and selling seamless and efficient.',
    },
  ];

  return (
    <div className="bg-neutral-bg min-h-screen pt-[100px] pb-24 font-sans">
      {/* Hero Section */}
      <section className="container-custom mb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6">
            <Building2 className="w-4 h-4" /> About EstateX
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-neutral-primary mb-6 leading-tight">
            Redefining the way you <span className="text-primary">find your home.</span>
          </h1>
          <p className="text-lg text-neutral-secondary leading-relaxed">
            EstateX is a premium real estate platform dedicated to connecting people with their dream properties. We combine innovative technology with industry expertise to provide a seamless, transparent, and rewarding real estate experience.
          </p>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="container-custom mb-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-8 rounded-3xl border border-neutral-border shadow-sm text-center">
              <div className="text-4xl font-display font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-neutral-secondary font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Mission & Values */}
      <section className="container-custom mb-24">
        <SectionHeader title="Our Core Values" subtitle="The principles that guide everything we do at EstateX." />
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-neutral-border hover:border-primary/30 transition-colors shadow-sm group"
              >
                <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-neutral-primary mb-3">{value.title}</h3>
                <p className="text-neutral-secondary leading-relaxed">{value.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Creator Section */}
      <section className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-3xl border border-neutral-border shadow-soft overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/5 relative min-h-[300px] bg-neutral-bg-secondary">
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800" 
                alt="Workspace" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-8">
                 <h2 className="text-3xl font-display font-bold text-white">Meet the Creator</h2>
              </div>
            </div>
            
            <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
              <div className="mb-2 text-primary font-bold tracking-wider uppercase text-sm">Lead Developer & Designer</div>
              <h3 className="text-3xl font-bold text-neutral-primary mb-4">Meet Modi</h3>
              <p className="text-neutral-secondary text-lg leading-relaxed mb-8">
                Hi, I'm the creator behind EstateX. My vision was to build a real estate platform that doesn't just list properties, but provides a premium, immersive experience. Combining modern web technologies with a passion for sleek, user-centric interfaces, EstateX was crafted to redefine how we search for our next home.
              </p>
              
              <div className="flex gap-4">
                <a href="https://github.com/MeetModi4510" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-neutral-bg hover:bg-primary hover:text-white text-neutral-primary transition-all flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/meet-modi-a227a1295/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-neutral-bg hover:bg-[#0077b5] hover:text-white text-neutral-primary transition-all flex items-center justify-center">
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="mailto:contact@estatex.com" className="w-12 h-12 rounded-full bg-neutral-bg hover:bg-red-500 hover:text-white text-neutral-primary transition-all flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
