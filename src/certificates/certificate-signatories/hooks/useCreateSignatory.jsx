const useCreateSignatory = ({ arrayHelpers }) => {
  const handleAddSignatory = () => {
    const getNewSignatory = () => ({
      name: '', title: '', organization: '', signatureImagePath: '',
    });

    arrayHelpers.push(getNewSignatory());
  };

  return { handleAddSignatory };
};

export default useCreateSignatory;
