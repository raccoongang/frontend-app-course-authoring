const FileList = ({ fileList }) => (
  <ul>
    {fileList.map((fileName) => (
      <li>{fileName}</li>
    ))}
  </ul>
);

export default FileList;
