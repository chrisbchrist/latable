import React, {ReactElement, useState} from 'react';
import Dropdown from "antd/es/dropdown";

export interface CellContextMenuProps {
    value: any
    buildMenu: ( setMenuVisible: (visible: boolean) => void ) => ReactElement
}

export const CellContextMenu = (props: CellContextMenuProps ) => {

    const [menuVisible, setMenuVisible] = useState(false);

    return (
        <Dropdown overlay={props.buildMenu(setMenuVisible)}
                  trigger={[`contextMenu`]}
                  onVisibleChange={ visible => setMenuVisible(visible)}
                  visible={menuVisible}>
            <div>{props.value}</div>
        </Dropdown>
    )

};