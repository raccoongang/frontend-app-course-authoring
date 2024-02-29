import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import {
  Card, useToggle, Sheet, Button,
} from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import ContentTagsDrawer from '../../content-tags-drawer/ContentTagsDrawer';
import useContentTagsDrawer from '../../content-tags-drawer/hooks/useContentTagsDrawer';
import ContentTagsCollapsible from '../../content-tags-drawer/ContentTagsCollapsible';
import Loading from '../../generic/Loading';
import { getCourseUnitData } from '../data/selectors';
import useCourseUnitData from '../sidebar/hooks';
import messages from '../course-xblock/messages';

const SidebarTags = ({
  blockId, ...props
}) => {
  const { visibleToStaffOnly } = useCourseUnitData(useSelector(getCourseUnitData));
  const intl = useIntl();
  const [isManageTagsOpen, openManageTagsModal, closeManageTagsModal] = useToggle(false);

  const {
    taxonomies,
    isTaxonomyListLoaded,
    isContentTaxonomyTagsLoaded,
  } = useContentTagsDrawer(blockId);

  return (
    <Card
      className={classNames('course-unit-sidebar', {
        'is-stuff-only': visibleToStaffOnly,
      })}
      {...props}
    >
      <div className="course-unit-sidebar-header">
        <h3 className="course-unit-sidebar-header-title m-0">
          Tags
        </h3>
      </div>
      <Card.Body className="course-unit-sidebar-date">
        { isTaxonomyListLoaded && isContentTaxonomyTagsLoaded
          ? taxonomies.map((data) => (
            <div key={`taxonomy-tags-collapsible-${data.id}`}>
              <ContentTagsCollapsible contentId={blockId} taxonomyAndTagsData={data} readOnly />
              <hr />
            </div>
          ))
          : <Loading />}
        <Button onClick={openManageTagsModal}>{intl.formatMessage(messages.blockLabelButtonManageTags)}</Button>
      </Card.Body>
      <Sheet
        position="right"
        show={isManageTagsOpen}
        blocking={false}
        variant="light"
        onClose={closeManageTagsModal}
      >
        <ContentTagsDrawer blockId={blockId} onCloseTagsDrawer={closeManageTagsModal} />
      </Sheet>
    </Card>
  );
};

SidebarTags.propTypes = {
  blockId: PropTypes.string.isRequired,
};

export default SidebarTags;
