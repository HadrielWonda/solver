import React, { useState } from "react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { TbColumnInsertRight, TbRowInsertBottom } from "react-icons/tb";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MdDeleteOutline } from "react-icons/md";

export default function TableUploadModal({
  initialData,
  setInitialData,
}: {
  initialData?: string[][];
  setInitialData: (data: string[][]) => void;
}) {
  const [data, setData] = useState(
    initialData ?? [
      ["1", "2", "3"],
      ["4", "5", "6"],
    ]
  );
  const uploadRef = React.createRef<HTMLInputElement>();

  return (
    <DialogContent className="w-fit h-fit max-w-[80vw] max-h-[90vh] flex flex-col">
      <DialogHeader>
        <DialogTitle>Input or Upload Table</DialogTitle>
        <DialogDescription>
          You can input table data manually or upload a CSV file
        </DialogDescription>
      </DialogHeader>
      <div>
        <Button
          onClick={() => {
            uploadRef.current?.click();
          }}
        >
          Upload CSV file
        </Button>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
              const content = e.target?.result as string;
              const rows = content.split("\n");
              const newData = rows.map((row) =>
                row.split(",").map((cell) => cell.trim())
              );
              setData(newData);
            };
            reader.readAsText(file);
          }}
          ref={uploadRef}
          className="hidden"
        />
      </div>
      <div className="flex-1 flex gap-4 overflow-x-auto overflow-y-clip">
        <div className="flex-1 flex gap-4 flex-col overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Row</TableHead>
                {data.map((_, i) => (
                  <TableHead key={i}>
                    <div className="flex flex-nowrap items-center gap-2">
                      <span className="font-bold text-nowrap">
                        {i == 0 ? "y" : data.length == 2 ? "x" : `x${i}`}
                      </span>
                      {data.length > 2 ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size={"icon"}
                                // className="self-center cursor-cell"
                                variant="destructive"
                                onClick={() => {
                                  setData(data.filter((_, j) => j !== i));
                                }}
                              >
                                <MdDeleteOutline size={20} color="white" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete column</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : null}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(Math.max(...data.map((invoice) => invoice.length)))
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="p-2 pr-5">
                      <div className="flex flex-nowrap items-center gap-2">
                        <span className="font-bold text-nowrap">{`Row ${
                          i + 1
                        }`}</span>
                        {data[0].length > 2 ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size={"icon"}
                                  // className="self-center cursor-cell"
                                  variant="destructive"
                                  onClick={() => {
                                    const newData = [...data];
                                    newData.forEach((column) =>
                                      column.splice(i, 1)
                                    );
                                    setData(newData);
                                  }}
                                >
                                  <MdDeleteOutline size={20} color="white" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete row</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : null}
                      </div>
                    </TableCell>
                    {data.map((column, j) => (
                      <TableCell key={`${i}${j}`} className="p-2">
                        <input
                          type="number"
                          value={column.length > i ? column[i] : 0}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            const newData = [...data];
                            newData[j][i] = newValue;
                            setData(newData);
                          }}
                          className="p-2"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size={"icon"}
                  className="self-center cursor-cell"
                  onClick={() => {
                    setData(data.map((column) => [...column, "0"]));
                  }}
                >
                  <TbRowInsertBottom size={20} color="white" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add row</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"icon"}
                className="self-center cursor-cell"
                onClick={() => {
                  setData([...data, Array(data[0].length).fill("0")]);
                }}
              >
                <TbColumnInsertRight size={20} color="white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add column</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <DialogFooter>
        <DialogClose
          onClick={() => {
            setInitialData(data);
          }}
        >
          <div className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1">
            Submit
          </div>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
