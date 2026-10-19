// Import necessary libraries
import React from 'react';
import PropTypes from 'prop-types';

// Card component
const Card = ({ icon, primaryValue, secondaryValue, label }) => {
  return (
    <div className="bg-white rounded-lg  p-6 text-center">
      <div className="mb-4">
        <i className={`text-2xl ${icon}`} aria-hidden="true"></i>
      </div>
      <div className="text-xl font-bold text-gray-800">{primaryValue}</div>
      {/* <div className="text-sm text-gray-500">{secondaryValue}</div> */}
      <div className="mt-2 text-sm text-gray-700">{label}</div>
    </div>
  );
};

Card.propTypes = {
  icon: PropTypes.string.isRequired,
  primaryValue: PropTypes.string.isRequired,
  secondaryValue: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default Card;
