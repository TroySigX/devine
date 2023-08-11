import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../utils/formatDate';

const ProfileEducation = ({
  education: { school, degree, fieldOfStudy, to, from, description },
}) => (
  <div>
    <h3 className='text-dark'>{school}</h3>
    <p>
      {formatDate(from)} - {to ? formatDate(to) : 'Present'}
    </p>
    <p>
      <strong>Degree:</strong> {degree}
    </p>
    {fieldOfStudy && (
      <p>
        <strong>Field Of Study:</strong> {fieldOfStudy}
      </p>
    )}
    {description && (
      <p>
        <strong>Description:</strong> {description}
      </p>
    )}
  </div>
);

ProfileEducation.propTypes = {
  education: PropTypes.object.isRequired,
};

export default ProfileEducation;
