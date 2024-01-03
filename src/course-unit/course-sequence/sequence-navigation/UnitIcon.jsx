import PropTypes from 'prop-types';
import { Icon } from '@edx/paragon';
import {
  VideoCamera as VideoCameraIcon,
  BookOpen as BookOpenIcon,
  FormatListBulleted as FormatListBulletedIcon,
  Edit as EditIcon,
  Lock as LockIcon,
} from '@edx/paragon/icons';

const UnitIcon = ({ type }) => {
  let icon = null;

  switch (type) {
  case 'video':
    icon = VideoCameraIcon;
    break;
  case 'other':
    icon = BookOpenIcon;
    break;
  case 'vertical':
    icon = FormatListBulletedIcon;
    break;
  case 'problem':
    icon = EditIcon;
    break;
  case 'lock':
    icon = LockIcon;
    break;
  default:
    icon = BookOpenIcon;
  }

  return (<Icon src={icon} />);
};

UnitIcon.propTypes = {
  type: PropTypes.oneOf(['video', 'other', 'vertical', 'problem', 'lock']).isRequired,
};

export default UnitIcon;
