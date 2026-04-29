import React from 'react'
import Slider from 'react-slick'
import { feedbacks } from "../data/feedbacks";
import FeedBackCard from './FeedBackCard'

const FeedBack = () => {
    var settings = {
        dots:true,
        infinite:false,
        speed:500,
        slidesToShow:2,
        slidesToScroll:1,
        responsive:[
        {
            breakpoint:1024,
            settings:{
                slidesToShow:1,
                slidesToScroll:1,
                infinite:false,
                dots:true
            }
        },
        {
            breakpoint:600,
            settings:{
                slidesToShow:1,
                slidesToScroll:1,
                infinite:false,
                dots:true
            }
        },
        {
            breakpoint:400,
            settings:{
                slidesToShow:1,
                slidesToScroll:1,
                infinite:false,
                dots:true
            }
        },
        ]
    }
  return (
    <section className='w-full bg-white py:4 md:py-14 p-4 '>
        <div className='md:max-w-[1100px] m-auto max-w-[400px]'>
        <h1 className='py-4 text-3xl font-bold'>Students <span className='text-[#00AFEF]'>Feed back</span></h1>
            <p className='text-[#6D737A] py-2'>Over the years, beneficiaries of the Wootlab LanguageLocal has some things to say.</p>
            {/* <Slider {...settings}>
                <FeedBackCard/>
                <FeedBackCard/>
                <FeedBackCard/>
                <FeedBackCard/>
                <FeedBackCard/>
            </Slider> */}
            <Slider {...settings}>
            {feedbacks && feedbacks.map(newFeedback => (
                <FeedBackCard
                key={newFeedback.id}
                title={newFeedback.title}
                img={newFeedback.img}
                name={newFeedback.name}
                testimony={newFeedback.testimony}
                 />
            ))}
               
            </Slider>
        </div>
    </section>    
  )
}

export default FeedBack


//   <Slider {...settings} className="px-5">
//           {courses &&
//             courses.map((course) => (
//               <CourseCard
//                 key={course.id}
//                 title={course.title}
//                 category={course.category}
//                 rating={course.rating}
//                 price={course.price}
//                 linkImg={course.linkImg}
//               />
//             ))}
//         </Slider>