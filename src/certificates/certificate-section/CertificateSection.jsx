import PropTypes from 'prop-types';
import { Stack } from '@edx/paragon';

const CertificateSection = ({
  title, actions, children, ...rest
}) => (
  <section {...rest}>
    <Stack className="justify-content-between" direction="horizontal">
      <h2 className="lead section-title">{title}</h2>
      {actions && actions}
    </Stack>
    <hr />
    <div>
      {children}
    </div>
  </section>
);

CertificateSection.defaultProps = {
  children: null,
  actions: null,
};
CertificateSection.propTypes = {
  children: PropTypes.node,
  actions: PropTypes.node,
  title: PropTypes.string.isRequired,
};

export default CertificateSection;
