import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, useToggle } from '@edx/paragon';

import { getCourseSectionVertical } from '../data/selectors';
import { COMPONENT_ICON_TYPES } from '../constants';
import ComponentIcon from './ComponentIcon';
import messages from './messages';
import { AdvancedModal } from './modals';

const AddComponent = ({ blockId, handleCreateNewCourseXblock }) => {
  const intl = useIntl();
  const [isOpen, open, close] = useToggle(false);
  const { componentTemplates } = useSelector(getCourseSectionVertical);

  const handleCreateNewXblock = (type, moduleName) => {
    switch (type) {
    case COMPONENT_ICON_TYPES.discussion:
    case COMPONENT_ICON_TYPES.dragAndDrop:
      handleCreateNewCourseXblock({ type, parentLocator: blockId });
      break;
    case COMPONENT_ICON_TYPES.library:
      handleCreateNewCourseXblock({ type, category: 'library_content', parentLocator: blockId });
      break;
    case COMPONENT_ICON_TYPES.advanced:
      handleCreateNewCourseXblock({
        type: moduleName, category: type, parentLocator: blockId,
      });
      break;
    default:
    }
  };

  if (!Object.keys(componentTemplates).length) {
    return null;
  }

  return (
    <div className="py-4">
      <h5 className="h3 mb-4 text-center">{intl.formatMessage(messages.title)}</h5>
      <ul className="new-component-type list-unstyled m-0 d-flex flex-wrap justify-content-center">
        {Object.keys(componentTemplates).map((component) => {
          if (componentTemplates[component].type === COMPONENT_ICON_TYPES.advanced) {
            return (
              <>
                <li key={componentTemplates[component].type}>
                  <Button
                    variant="outline-primary"
                    className="add-component-button flex-column rounded-sm"
                    onClick={open}
                  >
                    <ComponentIcon type={componentTemplates[component].type} />
                    <span className="sr-only">{intl.formatMessage(messages.buttonText)}</span>
                    <span className="small mt-2">{componentTemplates[component].displayName}</span>
                  </Button>
                </li>
                <AdvancedModal isOpen={isOpen} close={close} handleCreateNewXblock={handleCreateNewXblock} />
              </>
            );
          }
          return (
            <li key={componentTemplates[component].type}>
              <Button
                variant="outline-primary"
                className="add-component-button flex-column rounded-sm"
                onClick={() => handleCreateNewXblock(componentTemplates[component].type)}
              >
                <ComponentIcon type={componentTemplates[component].type} />
                <span className="sr-only">{intl.formatMessage(messages.buttonText)}</span>
                <span className="small mt-2">{componentTemplates[component].displayName}</span>
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

AddComponent.propTypes = {
  blockId: PropTypes.string.isRequired,
  handleCreateNewCourseXblock: PropTypes.func.isRequired,
};

export default AddComponent;
