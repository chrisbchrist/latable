import React, { FunctionComponent } from 'react';
import { Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css';
import "./VirtualizedTable.css";

const list = [
    { name: 'Brian Vaughn', description: 'Software engineer' },
    { name: 'Joe Sklorp', description: 'Software engineer' },
    { name: 'Sally Findow', description: 'Software engineer' },
    { name: 'Mac Attax', description: 'Software engineer' },
    { name: 'Bilbo Silverworth', description: 'Software engineer' }
    // And so on...
];

export const VirtualizedTable: FunctionComponent = () => {

    return (
        <Table
            width={500}
            height={300}
            headerHeight={55}
            rowHeight={55}
            rowCount={list.length}
            rowGetter={({ index }: any) => list[index]}
        >
            <Column
                label='Name'
                dataKey='name'
                width={200}
            />
            <Column
                width={200}
                label='Description'
                dataKey='description'
            />
        </Table>
    )
};