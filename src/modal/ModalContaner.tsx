import React, {ReactElement, useState} from 'react';
import ReactDOM, {createPortal} from 'react-dom'
import {Modal} from "antd";
import {ModalProps} from "antd/es/modal";

interface ModalContainerProps extends ModalProps {
    children?: ReactElement
    cleanup?: () => void
}

function ModalContainer( props: ModalContainerProps ) {

    const [modalVisible, setModalVisible] = useState<boolean>(true);

    function closeModal( e: React.MouseEvent<any>, closeOp?: (e: React.MouseEvent<any>) => void ): void {
        setModalVisible(false);
        if ( closeOp ) {
            closeOp(e)
        }
        if ( props.cleanup ) {
            props.cleanup()
        }
    }

    return (
        <Modal
            {...props}
            visible={modalVisible}
            onCancel={ e => closeModal(e, props.onCancel)}
            onOk={ e => closeModal(e, props.onOk)}>
            {props.children}
        </Modal>
    );

}

export function renderInModal( component: ReactElement, props: ModalProps ): void {

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