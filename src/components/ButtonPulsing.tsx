import React from 'react';
import LoadingButton, { LoadingButtonProps } from '@mui/lab/LoadingButton';
import { styled } from '@mui/material/styles';

// Extend LoadingButtonProps with shouldPulse property
interface StyledPulseLoadingButtonProps extends LoadingButtonProps {
    shouldPulse?: boolean;
}

const StyledPulseLoadingButton = styled(({ shouldPulse, ...otherProps }: StyledPulseLoadingButtonProps) => <LoadingButton {...otherProps} />)`
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.7;
    }
    50% {
      transform: scale(1.05);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0.7;
    }
  }

  ${({ shouldPulse }) =>
    shouldPulse && `
      &:not([disabled]) {
        animation: pulse 1.5s infinite;
      }
    `
}
`;

// Define props type for PulsingLoadingButton, which currently only includes shouldPulse but could be extended
interface ButtonPulsingProps extends LoadingButtonProps {
    shouldPulse?: boolean;
}

const ButtonPulsing = ({ shouldPulse, ...props }: ButtonPulsingProps) => {
    return <StyledPulseLoadingButton shouldPulse={shouldPulse} {...props} />;
}

export default ButtonPulsing;
