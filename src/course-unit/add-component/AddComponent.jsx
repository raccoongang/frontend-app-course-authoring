import { useSelector } from 'react-redux';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button } from '@edx/paragon';

import { getCourseSectionVertical } from '../data/selectors';
import ComponentIcon from './ComponentIcon';
import messages from './messages';

const AddComponent = () => {
  const intl = useIntl();
  const { componentTemplates } = useSelector(getCourseSectionVertical);

  if (!Object.keys(componentTemplates).length) {
    return null;
  }

  return (
    <div className="py-4">
      <h5 className="h3 mb-4 text-center">{intl.formatMessage(messages.title)}</h5>
      <ul className="new-component-type list-unstyled m-0 d-flex flex-wrap justify-content-center">
        {Object.keys(componentTemplates).map((component) => (
          <li key={componentTemplates[component].type}>
            <Button variant="outline-primary" className="add-component-button flex-column rounded-sm">
              <ComponentIcon type={componentTemplates[component].type} />
              <span className="sr-only">{intl.formatMessage(messages.buttonText)}</span>
              <span className="small mt-2">{componentTemplates[component].displayName}</span>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddComponent;