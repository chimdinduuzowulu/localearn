import React from 'react'
import cta from '../assets/arcp-1.png'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router'

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className='w-full bg-white py-16 px-4'>
      <div className='md:max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12 items-center'>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <img 
            src={cta} 
            alt="Join Wootlab learning platform" 
            className="w-full max-w-md rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-500" 
          />
        </motion.div>
        
        <motion.div 
          className='flex flex-col gap-6'
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900'>
            Join the Best Platform for <span className='text-[#00AFEF]'>Localized Learning</span>
          </h2>
          
          <p className='text-lg text-gray-600'>
            Start your educational journey today with courses designed specifically 
            for your language and learning needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <motion.button 
              className='px-8 py-4 bg-[#33468a] text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium shadow-md'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
            >
              Create Free Account
            </motion.button>
            
            <button 
              className='px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 font-medium'
              onClick={() => navigate('/courses')}
            >
              Browse Courses
            </button>
          </div>
          
          <div className="flex items-center gap-4 mt-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Start learning immediately</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTA;