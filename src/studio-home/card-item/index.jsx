import React from 'react';
import PropTypes from 'prop-types';
import { ActionRow, Card, Hyperlink } from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';

import messages from '../messages';

const CardItem = ({
  intl, displayName, lmsLink, rerunLink, org, number, isLibraries, url,
}) => {
  const courseUrl = new URL(url, getConfig().STUDIO_BASE_URL);

  return (
    <Card className="card-item">
      <Card.Header
        title={(
          <Hyperlink
            className="card-item-title"
            destination={courseUrl.toString()}
          >
            {displayName}
          </Hyperlink>
        )}
        subtitle={`${org} / ${number}`}
        actions={!isLibraries && (
          <ActionRow>
            <Hyperlink className="small" destination={rerunLink}>
              {intl.formatMessage(messages.btnReRunText)}
            </Hyperlink>
            <Hyperlink className="small ml-3" destination={lmsLink}>
              {intl.formatMessage(messages.viewLiveBtnText)}
            </Hyperlink>
          </ActionRow>
        )}
      />
    </Card>
  );
};

CardItem.defaultProps = {
  isLibraries: false,
  rerunLink: '',
  lmsLink: '',
};

CardItem.propTypes = {
  intl: intlShape.isRequired,
  displayName: PropTypes.string.isRequired,
  lmsLink: PropTypes.string,
  rerunLink: PropTypes.string,
  org: PropTypes.string.isRequired,
  number: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  isLibraries: PropTypes.bool,
};

export default injectIntl(CardItem);