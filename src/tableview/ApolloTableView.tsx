import React, {useEffect, useState} from 'react';
import {DomainEntity} from "../domain/Domain";
import {TableView, TableViewProps} from "./TableView";
import {ApolloClient, gql} from "apollo-boost";
import {useQuery} from "@apollo/react-hooks";
import {ColumnProps} from "antd/lib/table";
import {Omit} from "antd/es/_util/type";


interface ApolloColumnDefinition<T extends DomainEntity> {
    keyColumn: string,      // unique row identifier always aliased as 'key'
    columns?: ColumnProps<T>[] // all columns if undefined
    excludeColumns?: string[]
}


export interface ApolloTableViewProps<T extends DomainEntity> extends Omit<TableViewProps<T>, 'columns' | 'loadData'> {
    client: ApolloClient<any>;
    entityName: string
    columnDefs: ApolloColumnDefinition<T>
    query?: string
    queryName?: string;
}

function buildIntrospectionQuery( entityName: string ) {
    return `{
              __type(name: "${entityName}") {
                name
                fields {
                  dataIndex:name
                  title:description
                }
              }
            }`
}

export function ApolloTableView<T extends DomainEntity>( props: ApolloTableViewProps<T>) {

    const { client, columnDefs, entityName, ...otherProps} = props;
    const queryName = props.queryName || "findAll";
    const exludedColumns = !props.columnDefs.excludeColumns? []: props.columnDefs.excludeColumns


    const [introspectionQry, setIntrospectionQry] = useState(buildIntrospectionQuery(entityName));

    const columnData = useQuery(gql(introspectionQry), {client: client})


    function getColumns(): ColumnProps<T>[] | undefined {

        /*
            sample data output from the introspection query looks like...
            {
              "data": {
                "__type": {
                  "name": "Product",
                  "fields": [
                    {
                      "dataIndex": "beginDate",
                      "title": "Begin Date",
                      "__typename": "__Field"
                    },
         */
        const myFields = columnData.data.__type;

        // when a component is first run, the query may not have completed yet
        // resulting in myFields being 'nothing' if we don't account for this
        // the process will halt when we attempt to access methods or functions
        if (myFields) {

            const fields: ColumnProps<T>[] = myFields.fields;
            const cols = fields
                .filter( (c) => !c.dataIndex || !exludedColumns.includes(c.dataIndex))
                .map<ColumnProps<T>>(f => {

                let dataIndex = f.dataIndex === columnDefs.keyColumn? "key": f.dataIndex;

                return {
                    dataIndex: dataIndex,
                    key : dataIndex,
                    title: f.title || dataIndex === "key"? columnDefs.keyColumn: dataIndex
                }
            });

            cols.forEach(c => {
                console.log(`${c.dataIndex} -> ${c.title}`)
            });
            // setColumns(cols)
            return cols

        } else {
            console.log("data doesn't exist");
            return undefined;
        }
    };

    const defaultQuery = () => {

        let cols: ColumnProps<T>[] = columns ? columns : [{ dataIndex: "key"} ]

        return `{
        ${queryName} {
            ${cols.map( c =>
                `${c.dataIndex === 'key' ? `key:${columnDefs.keyColumn}` : c.dataIndex}`).join("\n")}
            }
        }`;
    }



    const [columns, setColumns] = useState<ColumnProps<T>[] | undefined>(columnDefs.columns || getColumns());
    const [query, setQuery] = useState(props.query || defaultQuery() );

    console.log(query);

    const { loading, data } = useQuery(gql(query), {client: client});

    useEffect( () => {
        setColumns(columnDefs.columns || getColumns());
    } );

    useEffect( () => {
        setQuery(props.query || defaultQuery());
    },[columns]);

    useEffect( () => {
        // setColumns(columnDefs.columns || getColumns());
        setIntrospectionQry(buildIntrospectionQuery(entityName));
    },[entityName]);

    return (
        <TableView
            columns={columns}
            loading={loading}
            loadData={ () => !loading && columns && data? data[queryName] as T[]: [] }
            {...otherProps}>
        </TableView>
    )

}
