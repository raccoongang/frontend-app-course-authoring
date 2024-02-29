// @ts-check
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  CloseButton,
  Spinner,
} from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useParams } from 'react-router-dom';
import messages from './messages';
import ContentTagsCollapsible from './ContentTagsCollapsible';
import { useContentData } from './data/apiHooks';
import useContentTagsDrawer from './hooks/useContentTagsDrawer';
import Loading from '../generic/Loading';

/** @typedef {import("../taxonomy/data/types.mjs").TaxonomyData} TaxonomyData */
/** @typedef {import("./data/types.mjs").Tag} ContentTagData */

const ContentTagsDrawer = ({ blockId, onCloseTagsDrawer }) => {
  const intl = useIntl();
  const { contentId } = /** @type {{contentId: string}} */(useParams());

  const { data: contentData, isSuccess: isContentDataLoaded } = useContentData(contentId || blockId);

  const {
    taxonomies,
    isTaxonomyListLoaded,
    isContentTaxonomyTagsLoaded,
  } = useContentTagsDrawer(contentId || blockId);

  const closeContentTagsDrawer = () => {
    if (onCloseTagsDrawer) {
      onCloseTagsDrawer();
    }
    // "*" allows communication with any origin
    window.parent.postMessage('closeManageTagsDrawer', '*');
  };

  useEffect(() => {
    const handleEsc = (event) => {
      /* Close drawer when ESC-key is pressed and selectable dropdown box not open */
      const selectableBoxOpen = document.querySelector('[data-selectable-box="taxonomy-tags"]');
      if (event.key === 'Escape' && !selectableBoxOpen) {
        closeContentTagsDrawer();
      }
    };
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (

    <div className="mt-1">
      <Container size="xl">
        <CloseButton onClick={() => closeContentTagsDrawer()} data-testid="drawer-close-button" />
        <span>{intl.formatMessage(messages.headerSubtitle)}</span>
        { isContentDataLoaded
          ? <h3>{ contentData.displayName }</h3>
          : (
            <div className="d-flex justify-content-center align-items-center flex-column">
              <Spinner
                animation="border"
                size="xl"
                screenReaderText={intl.formatMessage(messages.loadingMessage)}
              />
            </div>
          )}

        <hr />

        { isTaxonomyListLoaded && isContentTaxonomyTagsLoaded
          ? taxonomies.map((data) => (
            <div key={`taxonomy-tags-collapsible-${data.id}`}>
              <ContentTagsCollapsible contentId={contentId || blockId} taxonomyAndTagsData={data} />
              <hr />
            </div>
          ))
          : <Loading />}

      </Container>
    </div>
  );
};

ContentTagsDrawer.propTypes = {
  blockId: PropTypes.string,
  onCloseTagsDrawer: PropTypes.func,
};

ContentTagsDrawer.defaultProps = {
  blockId: '',
  onCloseTagsDrawer: null,
};

export default ContentTagsDrawer;
