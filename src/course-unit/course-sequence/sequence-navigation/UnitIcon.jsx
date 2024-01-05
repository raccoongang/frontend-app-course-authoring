import PropTypes from 'prop-types';
import { Icon } from '@edx/paragon';
import {
  VideoCamera as VideoCameraIcon,
  BookOpen as BookOpenIcon,
  FormatListBulleted as FormatListBulletedIcon,
  Edit as EditIcon,
  Lock as LockIcon,
} from '@edx/paragon/icons';

export const UNIT_ICON_TYPES = ['video', 'other', 'vertical', 'problem', 'lock'];

const UnitIcon = ({ type }) => {
  let icon = null;
  let srText = null;

  switch (type) {
  case 'video':
    icon = VideoCameraIcon;
    srText = type;
    break;
  case 'other':
    icon = BookOpenIcon;
    srText = type;
    break;
  case 'vertical':
    icon = FormatListBulletedIcon;
    srText = type;
    break;
  case 'problem':
    icon = EditIcon;
    srText = type;
    break;
  case 'lock':
    icon = LockIcon;
    srText = type;
    break;
  default:
    icon = BookOpenIcon;
    srText = type;
  }

  return (<Icon src={icon} screenReaderText={srText} />);
};

UnitIcon.propTypes = {
  type: PropTypes.oneOf(UNIT_ICON_TYPES).isRequired,
};

export default UnitIcon;
