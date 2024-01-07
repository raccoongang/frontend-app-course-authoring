import {
  BookOpen as BookOpenIcon,
  Edit as EditIcon,
  FormatListBulleted as FormatListBulletedIcon,
  Lock as LockIcon,
  VideoCamera as VideoCameraIcon,
} from '@edx/paragon/icons/es5';

export const UNIT_ICON_TYPES = ['video', 'other', 'vertical', 'problem', 'lock'];

export const typeToIconMapping = {
  video: VideoCameraIcon,
  other: BookOpenIcon,
  vertical: FormatListBulletedIcon,
  problem: EditIcon,
  lock: LockIcon,
};
