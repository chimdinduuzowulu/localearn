import React from 'react'
import CategoryCard from './CategoryCard'
import { 
  BsBookHalf, 
  BsLaptop, 
  BsBarChart, 
  BsCloudSun, 
  BsPiggyBank 
} from "react-icons/bs";
import { 
  TiHeart,
  TiDeviceDesktop,
  TiChartBar 
} from "react-icons/ti";
import { motion } from 'framer-motion'

const Categories = () => {
  const categories = [
    { icon: <BsBookHalf size={30} />, title: 'Basic Literacy and Numeracy' },
    { icon: <TiHeart size={30} />, title: 'Health and Nutrition' },
    { icon: <BsCloudSun size={30} />, title: 'Agriculture and Climate Change' },
    { icon: <BsPiggyBank size={30} />, title: 'Entrepreneurial and Financial Literacy' },
    { icon: <BsLaptop size={30} />, title: 'Work with Computers' },
    { icon: <TiDeviceDesktop size={30} />, title: 'Frontend Web Design Basics' },
    { icon: <BsBarChart size={30} />, title: 'Resource Mobilization' },
    { icon: <TiChartBar size={30} />, title: 'Digital Marketing' }
  ];

  return (
    <section className='w-full bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4'>
      <div className='md:max-w-[1200px] mx-auto'>
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
            Our <span className='text-[#00AFEF]'>Popular Categories</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Courses designed for everyone - no language barriers, just quality education
          </p>
        </motion.div>

        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <CategoryCard 
                icon={category.icon} 
                title={category.title} 
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories;