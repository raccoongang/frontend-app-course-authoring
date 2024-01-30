import FileList from './FileList';

const AlertContent = ({ files, text }) => (
  <>
    <span>{text}</span>
    <FileList fileList={files} />
  </>
);

export default AlertContent;
