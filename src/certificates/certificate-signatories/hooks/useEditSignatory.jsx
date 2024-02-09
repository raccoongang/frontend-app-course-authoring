const useEditSignatory = ({
  arrayHelpers, editModes, setEditModes, resetForm,
}) => {
  const handleDeleteSignatory = (id) => {
    arrayHelpers.remove(id);

    const newEditModes = { ...editModes };
    delete newEditModes[id];
    setEditModes(newEditModes);
  };

  const toggleEditSignatory = (id) => {
    setEditModes(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCancelUpdateSignatory = (id) => {
    toggleEditSignatory(id);
    resetForm();
  };

  return { toggleEditSignatory, handleDeleteSignatory, handleCancelUpdateSignatory };
};

export default useEditSignatory;
