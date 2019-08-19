import React, { useEffect, useState } from "react";
import { DomainEntity } from "../domain/Domain";
import { TableView, TableViewProps } from "./TableView";
import { ApolloClient, gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { ColumnProps } from "antd/lib/table";
import { Omit } from "antd/es/_util/type";


interface ApolloColumnDefinition<T extends DomainEntity> {
  keyColumn: string; // unique row identifier always aliased as 'key'
  columns?: ColumnProps<T>[]; // all columns if undefined
  excludeColumns?: string[];
}

export interface ApolloTableViewProps<T extends DomainEntity>
  extends Omit<TableViewProps<T>, "columns" | "loadData" | "loading"> {
  client: ApolloClient<any>;
  entityName: string;
  columnDefs: ApolloColumnDefinition<T>;
  query?: string;
  queryName?: string;
}

function buildIntrospectionQuery(entityName: string) {
  return gql`{
              __type(name: "${entityName}") {
                name
                fields {
                  dataIndex:name
                  title:description
                }
              }
            }`;
}

export function ApolloTableView<T extends DomainEntity>(
  props: ApolloTableViewProps<T>
) {
  const { client, columnDefs, entityName, ...otherProps } = props;
  const queryName = props.queryName || "findAll";
  const excludedColumns = !props.columnDefs.excludeColumns
    ? []
    : props.columnDefs.excludeColumns;

  // Refactored column function as async to ensure column data is fetched before the table is rendered
  const getColumnsAsync: (entityName: string) => Promise<ColumnProps<T>[]> | undefined = async (entityName: string) => {
    const introspectionQuery = buildIntrospectionQuery(entityName);
    const introspectionResult: any = await client.query({
      query: introspectionQuery
    });
    console.log(introspectionResult);

    const fields = introspectionResult.data.__type.fields;

      if (fields) {

          const cols = fields
              .filter((f: ColumnProps<T>) => !f.dataIndex || !excludedColumns.includes(f.dataIndex))
              .map((c: ColumnProps<T>) => {
                  let dataIndex =
                      c.dataIndex === columnDefs.keyColumn ? "key" : c.dataIndex;

                  return {
                      dataIndex: dataIndex,
                      key: dataIndex,
                      title:
                          c.title || dataIndex === "key" ? columnDefs.keyColumn : dataIndex
                  };
              });

          cols.forEach((c: ColumnProps<T>) => {
              console.log(`${c.dataIndex} -> ${c.title}`);
          });
          // setColumns(cols)
          return cols;
      } else {
          console.log("data doesn't exist");
          return undefined;
      }
  };

  const defaultQuery = () => {
    let cols: ColumnProps<T>[] = columns ? columns : [{ dataIndex: "key" }];

    return `{
        ${queryName} {
            ${cols
              .map(
                c =>
                  `${
                    c.dataIndex === "key"
                      ? `key:${columnDefs.keyColumn}`
                      : c.dataIndex
                  }`
              )
              .join("\n")}
            }
        }`;
  };

  const [columns, setColumns] = useState<ColumnProps<T>[] | undefined>(
    columnDefs.columns && columnDefs.columns
  );
  const [query, setQuery] = useState(props.query || defaultQuery());

  //console.log(query);

  const { loading, data } = useQuery(gql(query), { client });
  console.log(loading, data);

  // Awaiting resolution of column query before setting columns/rendering table
  useEffect(() => {
      const initializeColumns = async () => {
          const columns = await getColumnsAsync(entityName);
          setColumns(columns || columnDefs.columns);
          return columns || columnDefs;
      };
      initializeColumns()
  }, []);

  useEffect(() => {
    setQuery(props.query || defaultQuery());
  }, [columns]);


      return (
          <TableView
              columns={(columns && query && !loading) ? columns : []}
              loading={loading || !columns}
              loadData={() =>
                  columns && query && !loading ? (data[queryName] as T[]) : []
              }
              {...otherProps}
          >{props.children}</TableView>
      );

}
