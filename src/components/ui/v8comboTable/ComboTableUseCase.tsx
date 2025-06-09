import { useState } from "react"
import { ComboBoxTable } from "./ComboBoxTable" // We will create this
import { generateAnimalData } from "./makeData"
import type { ColumnDef } from "@tanstack/react-table"

type Animal = {
  id: string
  name: string
  class: string
  diet: string
}
// Define a more complex data structure for our table
const animals: Animal[] = generateAnimalData(40)

const columns: ColumnDef<Animal>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <div>{row.original.name}</div>
    },
  },
  { accessorKey: "class", header: "Class" },
  { accessorKey: "diet", header: "Diet" },
]

export function ComboTableUseCase() {
  const [selectedItem, setSelectedItem] = useState<Animal | undefined>(
    undefined
  )
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">Combo Table v8</h2>
      <p className="text-sm text-gray-500">
        A ComboBox whose popover is rendered as a table with tanstack table.
        Uses semantic HTML table. As Compound Component
      </p>
      <div className="border rounded p-4 bg-white shadow-sm">
        <ComboBoxTable
          label="Search Animals"
          items={animals}
          item={(i) => ({ key: i.id, textValue: i.name })}
          columns={columns}
          onSelectionChange={(key) => {
            setSelectedItem(animals.find((item) => item.id == key))
          }}
        >
          <ComboBoxTable.Label />
          <div style={{ display: "flex" }}>
            <ComboBoxTable.Input />
            <ComboBoxTable.Button />
          </div>
          <ComboBoxTable.Popover>
            <ComboBoxTable.ListBox />
          </ComboBoxTable.Popover>
        </ComboBoxTable>
        <div className="mt-4">
          <pre className="text-sm">{JSON.stringify(selectedItem, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}
