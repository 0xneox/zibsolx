import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { cn } from "@/lib/utils";

interface ResponsiveTableProps extends React.HTMLAttributes<HTMLDivElement> {
  headers: { key: string; label: string }[];
  data: any[];
  renderCell: (item: any, header: { key: string; label: string }) => React.ReactNode;
  onRowClick?: (item: any) => void;
}

export function ResponsiveTable({
  headers,
  data,
  renderCell,
  onRowClick,
  className,
  ...props
}: ResponsiveTableProps) {
  return (
    <div className={cn("w-full", className)} {...props}>
      {/* Desktop View */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header.key}>{header.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, idx) => (
              <TableRow
                key={idx}
                className={cn(onRowClick && "cursor-pointer hover:bg-muted/50")}
                onClick={() => onRowClick?.(item)}
              >
                {headers.map((header) => (
                  <TableCell key={header.key}>
                    {renderCell(item, header)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {data.map((item, idx) => (
          <div
            key={idx}
            className={cn(
              "rounded-lg border bg-card text-card-foreground shadow-sm p-4",
              onRowClick && "cursor-pointer hover:bg-muted/50"
            )}
            onClick={() => onRowClick?.(item)}
          >
            {headers.map((header) => (
              <div key={header.key} className="flex justify-between py-1">
                <span className="text-sm font-medium text-muted-foreground">
                  {header.label}
                </span>
                <span className="text-sm">{renderCell(item, header)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
