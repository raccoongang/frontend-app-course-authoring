import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button, Dropdown, DropdownButton, Hyperlink,
} from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import {
  getCourseModes, getCertificateActivationUrl, getCertificateWebViewUrl, getIsCertificateActive,
} from '../../data/selectors';
import messages from '../../messages';

const HeaderButtons = () => {
  const intl = useIntl();
  const courseModes = useSelector(getCourseModes);
  const certificateWebViewUrl = useSelector(getCertificateWebViewUrl);
  const certificateActivationHandlerUrl = useSelector(getCertificateActivationUrl);
  const isCertificateActive = useSelector(getIsCertificateActive);

  const [dropdowmItem, setDropdowmItem] = useState(courseModes[0]);

  return (
    <>
      <DropdownButton id="dropdown-basic-button" title={dropdowmItem} onSelect={(item) => setDropdowmItem(item)}>
        {courseModes.map((mode) => <Dropdown.Item key={mode} eventKey={mode}>{mode}</Dropdown.Item>)}
      </DropdownButton>
      <Button variant="outline-primary" as={Hyperlink} href={certificateWebViewUrl}>
        {intl.formatMessage(messages.headingActionsPreview)}
      </Button>
      <Button variant="outline-primary" as={Hyperlink} href={certificateActivationHandlerUrl}>
        {isCertificateActive
          ? intl.formatMessage(messages.headingActionsDeactivate)
          : intl.formatMessage(messages.headingActionsActivate)}
      </Button>
    </>
  );
};

export default HeaderButtons;
