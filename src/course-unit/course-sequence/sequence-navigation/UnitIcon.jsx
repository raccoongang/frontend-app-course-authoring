import PropTypes from 'prop-types';
import { Icon } from '@edx/paragon';
import { BookOpen as BookOpenIcon } from '@edx/paragon/icons';

import { typeToIconMapping, UNIT_ICON_TYPES } from '../../constants';

const UnitIcon = ({ type }) => {
  const icon = typeToIconMapping[type] || BookOpenIcon;

  return <Icon src={icon} screenReaderText={type} />;
};

UnitIcon.propTypes = {
  type: PropTypes.oneOf(UNIT_ICON_TYPES).isRequired,
};

export default UnitIcon;
