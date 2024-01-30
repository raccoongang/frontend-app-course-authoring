import PropTypes from 'prop-types';

import FileList from './FileList';

const FILE_LIST_DEFAULT_VALUE = [];

const AlertContent = ({ fileList, text }) => (
  <>
    <span>{text}</span>
    <FileList fileList={fileList} />
  </>
);

AlertContent.propTypes = {
  fileList: PropTypes.arrayOf(PropTypes.string),
  text: PropTypes.string.isRequired,
};

AlertContent.defaultProps = {
  fileList: FILE_LIST_DEFAULT_VALUE,
};

export default AlertContent;
