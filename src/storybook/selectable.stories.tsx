import {
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Selectable } from "@/components/w3/Selectable"
import React from "react"
import { makeData } from "./makeData"
// Assuming `data` is an array of objects with an `id` property

const data = makeData(50)
export function MyTableComponent() {
  //const [selected, setSelected] = React.useState<string[]>([])

  return (
    <div className="h-52 overflow-auto">
      <div>
        <Selectable.Root

        //selectedRowIds={selected} // Controlled mode
        //onSelectionChange={setSelected}
        // initialFocusedRowId={data.length > 0 ? data[0].id : null} // Optional: initial focus
        >
          <Selectable.Table>
            <TableCaption>A list of selectable items.</TableCaption>
            <TableHeader>
              <TableRow style={{ pointerEvents: "none" }}>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHeader>
            <Selectable.Body>
              {data.map((person) => (
                <Selectable.Row key={person.id} rowId={person.id.toString()}>
                  <TableCell>{person.id}</TableCell>
                  <TableCell>{person.firstName}</TableCell>
                  <TableCell>{person.progress}</TableCell>
                </Selectable.Row>
              ))}
            </Selectable.Body>
          </Selectable.Table>
        </Selectable.Root>
        {/* <pre>{JSON.stringify(selected, null, 2)}</pre> */}
      </div>
    </div>
  )
}
