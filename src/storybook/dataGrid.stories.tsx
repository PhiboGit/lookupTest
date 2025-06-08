import { DataGrid } from "@/components/aria/data-grid"
import { Cell, Column, Row, TableBody, TableHeader } from "react-stately"
import { makeData } from "./makeData"

const data = makeData(50)
export function MyDataGrid() {
  return (
    <div className="h-52 overflow-auto">
      <DataGrid
        selectionMode="multiple"
        aria-label="Example static collection DataGrid"
      >
        <TableHeader>
          <Column>ID</Column>
          <Column>Name</Column>
          <Column>Email</Column>
        </TableHeader>
        <TableBody>
          {data.map((person) => (
            <Row key={person.id}>
              <Cell>{person.id}</Cell>
              <Cell>{person.firstName}</Cell>
              <Cell>{person.progress}</Cell>
            </Row>
          ))}
        </TableBody>
      </DataGrid>
    </div>
  )
}
