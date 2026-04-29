import React from 'react'
import CourseCard from './CourseCard'
import { courses } from '../data/courses'
import Slider from 'react-slick'
import { motion } from 'framer-motion'

const Courses = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  }

  return (
    <section className="w-full bg-gray-50 py-16 px-4">
      <div className="md:max-w-[1200px] mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Most Popular <span className="text-[#00AFEF]">Courses</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our extensive library of courses spanning a wide range of subjects, 
            all available in your native language.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Slider {...settings} className="px-2">
            {courses && courses.map((course) => (
              <div key={course.id} className="px-3 py-4">
                <CourseCard
                  title={course.title}
                  category={course.category}
                  linkImg={course.linkImg}
                />
              </div>
            ))}
          </Slider>
        </motion.div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button className="px-8 py-3 bg-[#33468a] text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium">
            View All Courses
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default Courses;