import PropTypes from 'prop-types';
import {
  Image, Icon, Stack, IconButtonWithTooltip,
} from '@openedx/paragon';
import {
  EditOutline as EditOutlineIcon,
} from '@openedx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';

import commonMessages from '../../messages';
import messages from '../messages';

const Signatory = ({
  index,
  name,
  title,
  organization,
  signatureImagePath,
  handleEdit,
}) => {
  const intl = useIntl();

  return (
    <div className="bg-light-200 p-2.5 signatory" data-testid="signatory">
      <Stack className="justify-content-between mb-3" direction="horizontal">
        <h3 className="section-title">{`${intl.formatMessage(messages.signatoryTitle)} ${index + 1}`}</h3>
        <Stack direction="horizontal" gap="2">
          <IconButtonWithTooltip
            src={EditOutlineIcon}
            iconAs={Icon}
            alt={intl.formatMessage(commonMessages.editTooltip)}
            tooltipContent={<div>{intl.formatMessage(commonMessages.editTooltip)}</div>}
            onClick={handleEdit}
          />
        </Stack>
      </Stack>
      <Stack direction="horizontal" gap="2" className="signatory__fields-container" data-testid="signatory-view">
        <Stack className="signatory__text-fields-stack">
          <p className="signatory__text"><b>{intl.formatMessage(messages.nameLabel)}</b> {name}</p>
          <p className="signatory__text"><b>{intl.formatMessage(messages.titleLabel)}</b> {title}</p>
          <p className="signatory__text"><b>{intl.formatMessage(messages.organizationLabel)}</b> {organization}</p>
        </Stack>
        <div className="signatory__image-container">
          {signatureImagePath && (
            <Image
              src={`${getConfig().STUDIO_BASE_URL}${signatureImagePath}`}
              fluid
              alt={intl.formatMessage(messages.imageLabel)}
              className="signatory__image"
            />
          )}
        </div>
      </Stack>
    </div>
  );
};

Signatory.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  organization: PropTypes.string.isRequired,
  signatureImagePath: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  handleEdit: PropTypes.func.isRequired,
};

export default Signatory;
