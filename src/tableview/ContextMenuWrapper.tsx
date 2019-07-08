import React, {ReactElement, useState} from 'react';
import Dropdown from "antd/es/dropdown";

export interface ContextMenuWrapperProps {
    value: any
    buildMenu: (setMenuVisible: (visible: boolean) => void) => ReactElement
}

export const ContextMenuWrapper = (props: ContextMenuWrapperProps ) => {

    const { buildMenu, value} = props;
    const [menuVisible, setMenuVisible] = useState(false);

    return (
        <Dropdown overlay={buildMenu(setMenuVisible)}
                  trigger={[`contextMenu`]}
                  onVisibleChange={ visible => setMenuVisible(visible)}
                  visible={menuVisible}>
            <div>{value}</div>
        </Dropdown>
    )

};