import React, {ReactElement, useState} from 'react';
import Dropdown from "antd/es/dropdown";

export interface ContextMenuWrapperProps {
    value: any
    buildMenu: () => ReactElement
}

export interface ContextMenuDropdownContext {
    setMenuVisible: (visible: boolean) => void
}

// Following context only exists for context menus
// Undefined value acts as a flag to notify that context is not defined
export const ContextMenuDropdownContext = React.createContext<ContextMenuDropdownContext | undefined>(undefined);

export const ContextMenuDropdown = (props: ContextMenuWrapperProps ) => {

    const { buildMenu, value} = props;
    const [menuVisible, setMenuVisible] = useState(false);

    return (
        <ContextMenuDropdownContext.Provider value={{setMenuVisible: setMenuVisible}}>
            <Dropdown overlay={buildMenu()}
                      trigger={[`contextMenu`]}
                      onVisibleChange={visible => setMenuVisible(visible)}
                      visible={menuVisible}>
                <div>{value}</div>
            </Dropdown>
        </ContextMenuDropdownContext.Provider>
    )

};