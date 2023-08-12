import React from 'react';
import imageSrc from './tradeExalt.png'; // Replace with the actual path to your image

const MyComponentWithImage = (props) => {
  const { w, h } = props;
  return (
    <div>
      
      {/* <img  style={{ width: '240px', height: '170px' }}  src={imageSrc} alt="Description of the image" /> */}
      <img  style={{ width: w, height: h }}  src={imageSrc} alt="Description of the image" />
     
    </div>
  );
};

export default MyComponentWithImage;
