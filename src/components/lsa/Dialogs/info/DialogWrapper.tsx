import React, { useState } from 'react';
import { InfoDialogProps } from './InfoDialog';
import IconButton from '@mui/material/IconButton';
import InfoOutlined from '@mui/icons-material/InfoOutlined';

const dialogWrapper = <P extends object>(DialogComponent: React.ComponentType<P>) => {
    type RequiredProps = Exclude<InfoDialogProps, 'isOpen' | 'onClose'>;
    type IncomingProps = Omit<P, keyof RequiredProps>; // This type remove `RequiredProps` from the props of `DialogComponent`

    const DialogWrapperComponent: React.FC<IncomingProps> = (props) => {
        const [isOpen, setIsOpen] = useState(false);

        const handleOpen = () => setIsOpen(true);
        const handleClose = () => setIsOpen(false);

        return (
            <>
                <IconButton onClick={handleOpen} color={"primary"}>
                    <InfoOutlined/>
                </IconButton>
                <DialogComponent {...props as P} isOpen={isOpen} onClose={handleClose } />
            </>
        );
    };

    return DialogWrapperComponent;
};

export default dialogWrapper;