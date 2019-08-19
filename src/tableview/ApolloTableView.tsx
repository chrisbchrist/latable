import React, { useEffect, useState } from "react";
import { DomainEntity } from "../domain/Domain";
import { TableView, TableViewProps } from "./TableView";
import { ApolloClient, gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { ColumnProps } from "antd/lib/table";
import { Omit } from "antd/es/_util/type";
import { QueryResult } from "@apollo/react-common";

interface ApolloColumnDefinition<T extends DomainEntity> {
  keyColumn: string; // unique row identifier always aliased as 'key'
  columns?: ColumnProps<T>[]; // all columns if undefined
  excludeColumns?: string[];
  recursive?: boolean; //Flag to indicate whether columns should be generated recursively for subtypes
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
                    type {
                        fields {
                            dataIndex: name
                            title: description
                        }
                    }
                }
              }
            }`;
}

export function ApolloTableView<T extends DomainEntity>(
  props: ApolloTableViewProps<T>
) {
  const { client, columnDefs, entityName, ...otherProps } = props;
  const { recursive } = columnDefs;
  const queryName = props.queryName || "findAll";
  const excludedColumns = !props.columnDefs.excludeColumns
    ? []
    : props.columnDefs.excludeColumns;
  //const [isLoading, setLoading] = useState<boolean>(true);

  // Refactored column function as async to ensure column data is fetched before the table is rendered
  const getColumnsAsync: (
    entityName: string
  ) => Promise<ColumnProps<T>[]> | undefined = async (entityName: string) => {
    const introspectionQuery = buildIntrospectionQuery(entityName);
    const introspectionResult: any = await client.query({
      query: introspectionQuery
    });
    console.log(introspectionResult);

    const fields = introspectionResult.data.__type.fields;

    if (fields) {
      const cols = fields
        .filter(
          (f: any) =>
            !f.dataIndex || !excludedColumns.includes(f.dataIndex)
        )
        .map((c: any) => {
          let dataIndex =
            c.dataIndex === columnDefs.keyColumn ? "key" : c.dataIndex;
            if (recursive && c.type.fields) {
                c.type.fields.forEach((subField: any) => {
                    c.children.push({
                        dataIndex: subField.dataIndex,
                        key: subField.dataIndex,
                        title: subField.title || subField.dataIndex
                    })
                })
            }
          return {
            dataIndex: dataIndex,
            key: dataIndex,
            title:
                c.title ||
              (dataIndex === "key" ? columnDefs.keyColumn : dataIndex)
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
  //const hasQueryChanged = useCompare(query);

  //console.log(query);

  const { loading, data }: QueryResult<any> = useQuery(gql(query), {
    client,
    skip: !columns
  });
  console.log(query, loading, data);

  // Awaiting resolution of column query before setting columns/rendering table
  useEffect(() => {
    const initializeColumns = async () => {
      const columns = await getColumnsAsync(entityName);
      setColumns(columns || columnDefs.columns);
      return columns || columnDefs;
    };
    initializeColumns();
  }, []);

  useEffect(() => {
    if (query !== defaultQuery()) {
      console.log("Columns updated");
      setQuery(props.query || defaultQuery());
    }
  }, [columns]);

  return (
    <TableView
      columns={columns && query && !loading ? columns : []}
      loading={loading || !columns}
      loadData={() =>
        columns && query && !loading ? (data[queryName] as T[]) : []
      }
      {...otherProps}
    >
        {/*Forward children from UseApolloTableView component*/}
      {props.children}
    </TableView>
  );
}
