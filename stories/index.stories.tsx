import React from 'react';
const uuid4 = require('uuid/v4');

import {storiesOf} from '@storybook/react';
import { withKnobs, boolean } from '@storybook/addon-knobs';


import {Divider} from "antd";

import TableView from '../src/tableview/TableView';
import {InsertTableAction, RefreshTableAction, RemoveTableAction, UpdateTableAction} from "../src/tableview/Actions";

import '../src/indigo.css';
import PersonForm from "./PersonForm";
import Modals from "../src/modal/ModalContaner";
import {Person} from "./PersonFormik";

//TODO derive columns from domain entity
const columns = [{
    title: 'First Name',
    dataIndex: 'firstName',
    key: 'firstName',
}, {
    title: 'Last Name',
    dataIndex: 'lastName',
    key: 'lastName',
}, {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
}, {
    title: 'Profession',
    dataIndex: 'profession',
    key: 'profession',
}];

function age( bd: Date ): number {
    let diff =(new Date().getTime() - bd.getTime()) / 1000 / (60 * 60 * 24);
    return Math.abs(Math.floor(diff/365.25));
}

const data: Person[] = [
    {
        key:  uuid4(),
        firstName: "Jason",
        lastName: "Rocco",
        age : age( new Date(1971, 9, 15)),
        profession: 'Director',
    },
    {
        key: uuid4(),
        firstName: "Roman",
        lastName: "Vorobiev",
        age : age( new Date(1966, 7, 7)),
        profession: 'Software Developer',
    },
    {
        key: uuid4(),
        firstName: "Vladimir",
        lastName: "Birbrier",
        age : age( new Date(1978, 9, 15)),
        profession: 'Software Developer',
    },

];

// storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

// storiesOf('Button', module)
//   .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
//   .add('with some emoji', () => (
//     <Button onClick={action('clicked')}>
//       <span role="img" aria-label="so cool">
//         😀 😎 👍 💯
//       </span>
//     </Button>
//   ));

function confirmRemoval( person: Person ): Promise<boolean> {
    return Modals.confirm({
        title: 'Delete selected Item?',
        content: 'Some descriptions here',
        okType: 'primary'
    });
}


async function insertItem( person?: Person ): Promise<Person> {

    return new Promise<Person>( (resolve) => {

        let newPerson = person ? {...person, key: uuid4(), firstName: person!.firstName + " +"} :
            {key: uuid4(), firstName: "Unknown", lastName: "Unknown", age: 0, profession: 'Unknown'};

        Modals.show(<PersonForm {...person}/>, {
            title: 'Insert Person',
            okText: 'Create',
            onOk: () =>  resolve(newPerson),
            onCancel: () => resolve(undefined),
        })

    });
}

function updateItem( person: Person ): Promise<Person> {

    return new Promise<Person>( (resolve) => {

        let updatedPerson = {...person, age: person.age + 10, firstName: person.firstName + " ^"};

        Modals.show( <PersonForm {...person} />,{
            title   : 'Update Person',
            okText  : 'Update',
            onOk    : () => resolve(updatedPerson),
            onCancel: () => resolve(undefined),
        } )

    });

}

const retrieveData: () => Person[] = () => data;

const verboseToolbarTitle = 'Verbose Toolbar';
const multipleSelectionTitle = 'Multiple Selection';
const disableContextMenuTitle = 'Disable Context Menu';

storiesOf('TableView', module)

    .addDecorator(withKnobs)
    .addDecorator(story => <div style={{ padding: '1rem' }}>{story()}</div>)

    .add('with standard toolbar', () => {


        return (
            <TableView columns={columns}
                       loadData={retrieveData}
                       verboseToolbar={boolean(verboseToolbarTitle, false)}
                       multipleSelection={boolean(multipleSelectionTitle, false)}
                       disableContextMenu={boolean(disableContextMenuTitle, false)}>
                <RefreshTableAction/>
                <Divider type="vertical" dashed={true}/>
                <InsertTableAction onInsert={insertItem}/>
                <UpdateTableAction onUpdate={updateItem}/>
                <RemoveTableAction onRemove={confirmRemoval}/>
            </TableView>
        )
    })

    .add('with custom toolbar button properties', () => {

        return (
            <TableView columns={columns} style={{ userSelect: 'none' }}
                       loadData={retrieveData}
                       verboseToolbar={boolean(verboseToolbarTitle, false)}
                       multipleSelection={boolean(multipleSelectionTitle, false)}
                       disableContextMenu={boolean(disableContextMenuTitle, false)}>
                <RefreshTableAction iconProps={{spin:false}}/>
                <Divider type="vertical" dashed={true}/>
                <InsertTableAction text={'Create'}
                                   icon={'plus-circle'}
                                   type={'primary'}
                                   shape={'round'}
                                   onInsert= {insertItem} />
                <UpdateTableAction onUpdate= {updateItem} type={'dashed' } />
                <RemoveTableAction onRemove={confirmRemoval} type={'danger'} />
            </TableView>
        )

    })

    .add('with custom table properties', () => {

        return (
            <TableView columns={columns}
                       bordered
                       loadData={retrieveData}
                       verboseToolbar={boolean(verboseToolbarTitle, false)}
                       multipleSelection={boolean(multipleSelectionTitle, false)}
                       disableContextMenu={boolean(disableContextMenuTitle, false)}>
                <RefreshTableAction />
                <Divider type="vertical" dashed={true}/>
                <InsertTableAction onInsert={insertItem} />
                <UpdateTableAction onUpdate={updateItem} />
                <RemoveTableAction onRemove={confirmRemoval} />
            </TableView>
        )

    })


;
