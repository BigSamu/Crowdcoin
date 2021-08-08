import React, {useEffect} from 'react'

import {
  Button,
  Spinner,
} from 'react-bootstrap';

const LoadingButton = (props) => {

  const {buttonTitle, buttonVariant, buttonType, isLoading, buttonDisabled, buttonSize, callback, nonPaddingY} = props;
  
  return (
    <>
      <Button 
        variant={buttonVariant} 
        type={buttonType}
        disabled={isLoading || buttonDisabled} 
        size={buttonSize}
        onClick = {callback}
        className={nonPaddingY ? "py-0 w-100" : ""}
      >
        {isLoading ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            <span> {buttonSize !== "sm" ? "Loading" : ""}</span>
          </>
        ) : (
          <span>{buttonTitle}</span>
        )}
      </Button>
    </>
  )
}

export default LoadingButton
