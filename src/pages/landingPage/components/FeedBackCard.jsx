import React from 'react'
import avatar from '../assets/avatar.png'
import quotationMark from '../assets/quotationMark-1.png'

const FeedBackCard = ({ name, title, testimony, img }) => {
  return (
    <div className="bg-white p-8 border shadow-sm my-8 mx-2">
      <div className="flex justify-between">
        <div className="flex gap-4">
          <img src={img} alt="feedback" className=''  />
          <div>
            <h1>{name}</h1>
            <p>{title}</p>
          </div>
          <img src={quotationMark} alt="quote" className="h-8 " />
        </div>
      </div>
      <div className="py-8">
        <h3 className="text-lg">{testimony}</h3>
      </div>
    </div>
  );
};

export default FeedBackCard