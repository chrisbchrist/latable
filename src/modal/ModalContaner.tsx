import React, {ReactElement, useState} from 'react';
import ReactDOM from 'react-dom'
import {Modal} from "antd";
import {ModalFuncProps, ModalProps} from "antd/es/modal";

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
    // const [onCreate, setOnCreate] = useState( () => void );

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
        closeModal
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

export default class Modals {


    //TODO Document the ModalContainerContext
    /**
     * Shows an arbitrary content within a modal window
     * @param content modal window content
     * @param props properties of modal window
     */
    public static show(content: ReactElement, props?: ModalProps): void {

        let modalParent = document.createElement('div');
        document.body.appendChild(modalParent);

        function destroyElement() {
            let unmountResult = ReactDOM.unmountComponentAtNode(modalParent);
            if (unmountResult && modalParent.parentNode) {
                modalParent.parentNode.removeChild(modalParent);
            }
        }

        ReactDOM.render(
            <ModalContainer {...props} children={content} cleanup={destroyElement} />,
            modalParent
        );
    }

    /**
     * Shows confirmation modal window.
     * @param props modal's props
     * @returns Promise<boolean> indicating the async nature of confirmation
     */
    public static async confirm(props: ModalFuncProps): Promise<void> {
        return new Promise((resolve,reject) => {
            Modal.confirm({
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                ...props,
                onOk    : () => resolve(),
                onCancel: () => reject(),//resolve(false),
            })
        });

    }

}