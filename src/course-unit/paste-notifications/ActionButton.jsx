import { Button } from '@edx/paragon';
import { Link } from 'react-router-dom';
import { getConfig } from '@edx/frontend-platform';

const ActionButton = ({ courseId, title }) => (
  <Button
    as={Link}
    to={`${getConfig().STUDIO_BASE_URL}/assets/${courseId}/`}
    size="sm"
  >
    {title}
  </Button>
);

export default ActionButton;
