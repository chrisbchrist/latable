import React, {ReactElement, useState} from 'react';
import ReactDOM from 'react-dom'
import {Modal} from "antd";
import {ModalProps} from "antd/es/modal";

export interface ModalContainerContext {
    setOkDisabled: (disable: boolean) => void
    setLoading:(loading: boolean) => void
}

export const ModalContainerContext = React.createContext<any>({});

interface ModalContainerProps extends ModalProps {
    children?: ReactElement
    cleanup?: () => void
}

function ModalContainer( props: ModalContainerProps ) {

    const [modalVisible, setModalVisible] = useState<boolean>(true);
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const [okDisabled, setOkDisabled] = useState<boolean>(false);

    function closeModal( e: React.MouseEvent<any>, closeOp?: (e: React.MouseEvent<any>) => void ): void {
        setModalVisible(false);
        if ( closeOp ) {
            closeOp(e)
        }
        if ( props.cleanup ) {
            props.cleanup()
        }
    }

    const context = {
        setOkDisabled: setOkDisabled,
        setLoading:setConfirmLoading,
    };

    return (
        <ModalContainerContext.Provider value={context}>
            <Modal
                {...props}
                visible={modalVisible}
                okButtonProps={{disabled: okDisabled}}
                confirmLoading={confirmLoading}
                onCancel={ e => closeModal(e, props.onCancel)}
                onOk={ e => closeModal(e, props.onOk)}>
                {props.children}
            </Modal>
        </ModalContainerContext.Provider>
    );

}

export function renderInModal( component: ReactElement, props?: ModalProps ): void {

    let div = document.createElement('div');
    document.body.appendChild(div);

    function destroyElement() {
        let unmountResult = ReactDOM.unmountComponentAtNode(div);
        if (unmountResult && div.parentNode) {
            div.parentNode.removeChild(div);
        }
    }

    ReactDOM.render( <ModalContainer {...props} children={component} cleanup={destroyElement} />, div);
}