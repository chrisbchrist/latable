import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from "react";
import Checkbox from "antd/es/checkbox";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { TableViewContext } from "../NewTable";

// This method simply sorts and stringifies an array, then compares to determine equality. This will not work
// on arrays of objects or other complex data structures
const simpleArrayEquals: (
  a: Array<string | number>,
  b: Array<string | number>
) => boolean = (a, b) => {
  return JSON.stringify(a.sort()) === JSON.stringify(b.sort());
};

export const SelectionHeader: FunctionComponent<any> = ({
  cells,
  columns,
  headerIndex
}) => {
  const [checked, setChecked] = useState<boolean>(false);
  const [indeterminate, setIndeterminate] = useState<boolean>(false);

  const { selectionModel, allKeys, selectedRowKeys } = useContext(
    TableViewContext
  );

  useEffect(() => {
    setChecked(simpleArrayEquals(selectedRowKeys, allKeys) && selectedRowKeys.length > 0);
    setIndeterminate(selectedRowKeys.length > 0 && selectedRowKeys.length < allKeys.length);
  }, [selectedRowKeys, allKeys]);

  const handleChange = (e: CheckboxChangeEvent) => {
    console.log(e.target.checked);
    if (e.target.checked) {
      selectionModel.set(allKeys);
    } else {
      selectionModel.clear();
    }
    setChecked(e.target.checked);
  };

  return (
    <div>
      <Checkbox onChange={handleChange} checked={checked} indeterminate={indeterminate} />
    </div>
  );
};
