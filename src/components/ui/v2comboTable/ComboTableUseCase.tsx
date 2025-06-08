import { useState } from "react"
import { ComboBoxTable } from "./ComboBoxTable" // We will create this
import { Item } from "react-stately"

type Animal = {
  id: number
  name: string
  class: string
  diet: string
}
// Define a more complex data structure for our table
const animals: Animal[] = [
  { id: 1, name: "Red Panda", class: "Mammal", diet: "Herbivore" },
  { id: 2, name: "Cat", class: "Mammal", diet: "Carnivore" },
  { id: 3, name: "Dog", class: "Mammal", diet: "Omnivore" },
  { id: 4, name: "Aardvark", class: "Mammal", diet: "Insectivore" },
  { id: 5, name: "Kangaroo", class: "Mammal", diet: "Herbivore" },
  { id: 6, name: "Snake", class: "Reptile", diet: "Carnivore" },
  { id: 7, name: "Elephant", class: "Mammal", diet: "Herbivore" },
  { id: 8, name: "Giraffe", class: "Mammal", diet: "Herbivore" },
  { id: 9, name: "Lion", class: "Mammal", diet: "Carnivore" },
  { id: 10, name: "Tiger", class: "Mammal", diet: "Carnivore" },
  { id: 11, name: "Zebra", class: "Mammal", diet: "Herbivore" },
]

const cellStyle: React.CSSProperties = {
  padding: "8px 12px",
  flex: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}

export function ComboTableUseCase() {
  const [selectedItem, setSelectedItem] = useState<Animal | undefined>(
    undefined
  )
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">Combo Table</h2>
      <p className="text-sm text-gray-500">
        A ComboBox whose popover is rendered as a ul li with flex content and
        tanstack table.
      </p>
      <div className="border rounded p-4 bg-white shadow-sm">
        <ComboBoxTable
          label="Search Animals"
          onSelectionChange={(key) => {
            setSelectedItem(animals.find((item) => item.id == key))
          }}
          items={animals}
        >
          {(item) => (
            // textValue is crucial. It tells the ComboBox what value to
            // use for filtering and for displaying in the input when selected.
            <Item key={item.id} textValue={item.name}>
              <div className="name" style={{ ...cellStyle }}>
                {item.name}
              </div>
              <div className="class" style={cellStyle}>
                {item.class}
              </div>
              <div className="diet" style={cellStyle}>
                {item.diet}
              </div>
            </Item>
          )}
        </ComboBoxTable>
        <div className="mt-4">
          <pre className="text-sm">{JSON.stringify(selectedItem, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}
