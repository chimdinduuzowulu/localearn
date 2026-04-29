import React from 'react'
import {BsArrowUpRight} from 'react-icons/bs'
import { motion } from 'framer-motion'

const CategoryCard = ({icon, title}) => {
  return (
    <motion.div 
      className="bg-white p-6 rounded-xl shadow-sm border border-transparent hover:border-blue-300 hover:shadow-md transition-all duration-300 group cursor-pointer"
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {title}
          </h3>
        </div>
        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
          <BsArrowUpRight className="text-blue-600 text-lg" />
        </div>
      </div>
    </motion.div>
  )
}

export default CategoryCard;