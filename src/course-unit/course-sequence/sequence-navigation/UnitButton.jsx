import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@edx/paragon';
import { Link } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';

import UnitIcon from './UnitIcon';

const UnitButton = ({
  onClick, title, contentType, isActive, unitId, className, showTitle,
}) => {
  const { courseId } = useSelector(state => state.courseDetail);
  const { sequenceId } = useSelector(state => state.courseUnit);

  const handleClick = useCallback(() => {
    onClick(unitId);
  }, [onClick, unitId]);

  return (
    <Button
      className={className}
      variant={isActive ? 'primary' : 'outline-primary'}
      as={Link}
      onClick={handleClick}
      title={title}
      to={`/course/${courseId}/container/${unitId}/${sequenceId}/`}
    >
      <UnitIcon type={contentType} />
      {showTitle && <span className="unit-title">{title}</span>}
    </Button>
  );
};

UnitButton.propTypes = {
  className: PropTypes.string,
  contentType: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  showTitle: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  unitId: PropTypes.string.isRequired,
};

UnitButton.defaultProps = {
  className: undefined,
  isActive: false,
  showTitle: false,
};

const mapStateToProps = (state, props) => {
  if (props.unitId) {
    return {
      ...state.models.units[props.unitId],
    };
  }
  return {};
};

export default connect(mapStateToProps)(UnitButton);
