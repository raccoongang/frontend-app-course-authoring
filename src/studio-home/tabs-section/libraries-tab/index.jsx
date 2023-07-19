import React from 'react';
import PropTypes from 'prop-types';

import CardItem from '../../card-item';

const LibrariesTab = ({ libraries }) => (
  <div className="courses-tab">
    {libraries.map(({
      displayName, org, number, url,
    }) => (
      <CardItem
        key={number}
        isLibraries
        displayName={displayName}
        org={org}
        number={number}
        url={url}
      />
    ))}
  </div>
);

LibrariesTab.propTypes = {
  libraries: PropTypes.arrayOf(
    PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      libraryKey: PropTypes.string.isRequired,
      number: PropTypes.string.isRequired,
      org: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default LibrariesTab;
