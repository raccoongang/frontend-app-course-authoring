import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@edx/paragon';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { connect, useSelector } from 'react-redux';

import UnitIcon from './UnitIcon';

/* eslint-disable react/prop-types */
const UnitButton = ({
  isActive, onClick, title, unitId, contentType,
}) => {
  const { courseId } = useSelector(state => state.courseDetail);
  const { sequenceId } = useSelector(state => state.courseUnit);
  const handleClick = useCallback(() => {
    onClick(unitId);
  }, [onClick, unitId]);

  return (
    <Button
      className={classNames('w-100', { 'sequence-nav-button': !isActive })}
      variant={isActive ? 'primary' : 'outline-primary'}
      as={Link}
      onClick={handleClick}
      title={title}
      to={`/course/${courseId}/container/${unitId}/${sequenceId}/`}
    >
      <UnitIcon type={contentType} />
    </Button>
  );
};

UnitButton.propTypes = {
  isActive: PropTypes.bool.isRequired,
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
