import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@mui/material";
import type { ReactNode } from "react";

type Column<T> = { header: string; accessor: (row: T) => ReactNode };

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
};

export const DataTable = <T,>({ columns, data }: DataTableProps<T>) => (
  <Table>
    <TableHead>
      <TableRow>
        {columns.map((column) => (
          <TableCell key={column.header}>{column.header}</TableCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      {data.map((row, index) => (
        <TableRow key={index}>
          {columns.map((column) => (
            <TableCell key={column.header}>{column.accessor(row)}</TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
