import React, { useState } from 'react';

export const Slider = () => {
  const [value, setValue] = useState(50);

  const handleChange = (event) => {
    setValue(event.target.value);
  }

  return (
    <div>
      <input
        type="range"
        min="0"
        max="255"
        value={value}
        onChange={handleChange}
      />
      <p>Value: {value}</p>
    </div>
  );
}

//export default Slider;