import React from 'react';
import imageSrc from './tradeExalt.jpg'; // Replace with the actual path to your image

const MyComponentWithImage = () => {
  return (
    <div>
      
      <img  style={{ width: '230px', height: '150px' }}  src={imageSrc} alt="Description of the image" />
     
    </div>
  );
};

export default MyComponentWithImage;
