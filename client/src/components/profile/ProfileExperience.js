import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../utils/formatDate';

const ProfileExperience = ({
  experience: { company, title, location, to, from, description },
}) => (
  <div>
    <h3 className='text-dark'>{company}</h3>
    <p>
      {formatDate(from)} - {to ? formatDate(to) : 'Present'}
    </p>
    <p>
      <strong>Position:</strong> {title}
    </p>
    {location && (
      <p>
        <strong>Location:</strong> {location}
      </p>
    )}
    {description && (
      <p>
        <strong>Description:</strong> {description}
      </p>
    )}
  </div>
);

ProfileExperience.propTypes = {
  experience: PropTypes.object.isRequired,
};

export default ProfileExperience;
