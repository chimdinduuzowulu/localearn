import React from 'react'
import Achieve from '../assets/site.png'
import { FaRegCheckCircle } from "react-icons/fa";
import { motion } from 'framer-motion'

const Navigate = () => {
  const steps = [
    "Create or login to your existing account",
    "Select the course you are interested in",
    "Take the first lesson module in that course",
    "Continue learning in your native language"
  ];

  return (
    <section className="w-full bg-white py-16 px-4">
      <div className="md:max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            How To <span className="text-[#00AFEF]">Navigate The App</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Follow these simple steps to start your learning journey with Wootlab
          </p>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-300"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex-shrink-0 mt-1">
                  <FaRegCheckCircle className="text-[#33468a] text-xl" />
                </div>
                <p className="text-gray-700">{step}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center"
        >
          <img
            src={Achieve}
            alt="App navigation demonstration"
            className="w-full max-w-md rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-500"
          />
        </motion.div>
      </div>
    </section>
  );
}

export default Navigate;