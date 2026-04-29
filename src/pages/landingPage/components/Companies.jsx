import React from 'react';
import { motion } from 'framer-motion';

const Companies = () => {
  return (
    <section className="w-full bg-white py-16 px-4">
      <div className="md:max-w-[1200px] mx-auto text-center">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-[#00AFEF] mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Wootlab's Vision
        </motion.h2>
        
        <motion.p 
          className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          We envision a world where language is no barrier to education and where 
          everyone has the tools they need to succeed, regardless of their location 
          or internet connectivity.
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {[
            { icon: "🌍", title: "Global Access", desc: "Learning materials available worldwide" },
            { icon: "📱", title: "Offline First", desc: "Learn without internet connection" },
            { icon: "🎯", title: "Localized Content", desc: "Courses in native languages" }
          ].map((item, index) => (
            <motion.div 
              key={index}
              className="bg-blue-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Companies;