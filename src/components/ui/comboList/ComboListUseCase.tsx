import { Item } from "react-stately"
import { ComboBoxListBox } from "./ComboboxListBox"

// Define a more complex data structure for our table
const animals = [
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

export function ComboListUseCase() {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">Combo List</h2>
      <p className="text-sm text-gray-500">
        A ComboBox whose popover is rendered as a ul li.
      </p>
      <div className="border rounded p-4 bg-white shadow-sm">
        {/* Combo List content will go here */}
        <ComboBoxListBox label="Favorite Animal">
          {animals.map((animal) => (
            <Item key={animal.id}>{animal.name}</Item>
          ))}
        </ComboBoxListBox>
      </div>
    </div>
  )
}
