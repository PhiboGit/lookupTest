import { useState } from "react"
import { ComboBoxTable } from "./ComboBoxTable" // We will create this
import { Item } from "react-stately"
import { TableCell } from "../table"

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
  { id: 12, name: "Crocodile", class: "Reptile", diet: "Carnivore" },
  { id: 13, name: "Penguin", class: "Bird", diet: "Carnivore" },
  { id: 14, name: "Ostrich", class: "Bird", diet: "Herbivore" },
  { id: 15, name: "Frog", class: "Amphibian", diet: "Insectivore" },
  { id: 16, name: "Tortoise", class: "Reptile", diet: "Herbivore" },
  { id: 17, name: "Dolphin", class: "Mammal", diet: "Carnivore" },
  { id: 18, name: "Whale", class: "Mammal", diet: "Carnivore" },
  { id: 19, name: "Bat", class: "Mammal", diet: "Insectivore" },
  { id: 20, name: "Parrot", class: "Bird", diet: "Omnivore" },
  { id: 21, name: "Koala", class: "Mammal", diet: "Herbivore" },
  { id: 22, name: "Sloth", class: "Mammal", diet: "Herbivore" },
  { id: 23, name: "Octopus", class: "Mollusk", diet: "Carnivore" },
  { id: 24, name: "Jellyfish", class: "Cnidarian", diet: "Carnivore" },
  { id: 25, name: "Crab", class: "Crustacean", diet: "Omnivore" },
  { id: 26, name: "Lobster", class: "Crustacean", diet: "Carnivore" },
  { id: 27, name: "Shrimp", class: "Crustacean", diet: "Omnivore" },
  { id: 28, name: "Starfish", class: "Echinoderm", diet: "Carnivore" },
  { id: 29, name: "Sea Urchin", class: "Echinoderm", diet: "Herbivore" },
  { id: 30, name: "Sea Turtle", class: "Reptile", diet: "Herbivore" },
  { id: 31, name: "Walrus", class: "Mammal", diet: "Carnivore" },
  { id: 32, name: "Otter", class: "Mammal", diet: "Carnivore" },
  { id: 33, name: "Beaver", class: "Mammal", diet: "Herbivore" },
  { id: 34, name: "Raccoon", class: "Mammal", diet: "Omnivore" },
  { id: 35, name: "Skunk", class: "Mammal", diet: "Omnivore" },
  { id: 36, name: "Porcupine", class: "Mammal", diet: "Herbivore" },
  { id: 37, name: "Armadillo", class: "Mammal", diet: "Insectivore" },
  { id: 38, name: "Hedgehog", class: "Mammal", diet: "Insectivore" },
  { id: 39, name: "Badger", class: "Mammal", diet: "Omnivore" },
  { id: 40, name: "Wolverine", class: "Mammal", diet: "Carnivore" },
  { id: 41, name: "Meerkat", class: "Mammal", diet: "Omnivore" },
  { id: 42, name: "Hyena", class: "Mammal", diet: "Carnivore" },
  { id: 43, name: "Cheetah", class: "Mammal", diet: "Carnivore" },
  { id: 44, name: "Leopard", class: "Mammal", diet: "Carnivore" },
  { id: 45, name: "Jaguar", class: "Mammal", diet: "Carnivore" },
  { id: 46, name: "Puma", class: "Mammal", diet: "Carnivore" },
  { id: 47, name: "Cougar", class: "Mammal", diet: "Carnivore" },
  { id: 48, name: "Lynx", class: "Mammal", diet: "Carnivore" },
  { id: 49, name: "Bobcat", class: "Mammal", diet: "Carnivore" },
  { id: 50, name: "Ocelot", class: "Mammal", diet: "Carnivore" },
  { id: 51, name: "Serval", class: "Mammal", diet: "Carnivore" },
  { id: 52, name: "Caracal", class: "Mammal", diet: "Carnivore" },
  { id: 53, name: "African Wild Dog", class: "Mammal", diet: "Carnivore" },
  { id: 54, name: "Dingo", class: "Mammal", diet: "Carnivore" },
  { id: 55, name: "Jackal", class: "Mammal", diet: "Carnivore" },
  { id: 56, name: "Fox", class: "Mammal", diet: "Omnivore" },
  { id: 57, name: "Wolf", class: "Mammal", diet: "Carnivore" },
  { id: 58, name: "Coyote", class: "Mammal", diet: "Carnivore" },
  { id: 59, name: "Wild Boar", class: "Mammal", diet: "Omnivore" },
  { id: 60, name: "Bison", class: "Mammal", diet: "Herbivore" },
  { id: 61, name: "Buffalo", class: "Mammal", diet: "Herbivore" },
  { id: 62, name: "Antelope", class: "Mammal", diet: "Herbivore" },
  { id: 63, name: "Gazelle", class: "Mammal", diet: "Herbivore" },
  { id: 64, name: "Impala", class: "Mammal", diet: "Herbivore" },
  { id: 65, name: "Kudu", class: "Mammal", diet: "Herbivore" },
  { id: 66, name: "Springbok", class: "Mammal", diet: "Herbivore" },
  { id: 67, name: "Wildebeest", class: "Mammal", diet: "Herbivore" },
  { id: 68, name: "Zebu", class: "Mammal", diet: "Herbivore" },
  { id: 69, name: "Yak", class: "Mammal", diet: "Herbivore" },
  { id: 70, name: "Musk Ox", class: "Mammal", diet: "Herbivore" },
  { id: 71, name: "Reindeer", class: "Mammal", diet: "Herbivore" },
  { id: 72, name: "Moose", class: "Mammal", diet: "Herbivore" },
  { id: 73, name: "Elk", class: "Mammal", diet: "Herbivore" },
  { id: 74, name: "Deer", class: "Mammal", diet: "Herbivore" },
  { id: 75, name: "Caribou", class: "Mammal", diet: "Herbivore" },
  { id: 76, name: "Antelope", class: "Mammal", diet: "Herbivore" },
  { id: 77, name: "Gazelle", class: "Mammal", diet: "Herbivore" },
  { id: 78, name: "Impala", class: "Mammal", diet: "Herbivore" },
  { id: 79, name: "Kudu", class: "Mammal", diet: "Herbivore" },
  { id: 80, name: "Springbok", class: "Mammal", diet: "Herbivore" },
  { id: 81, name: "Wildebeest", class: "Mammal", diet: "Herbivore" },
  { id: 82, name: "Zebu", class: "Mammal", diet: "Herbivore" },
  { id: 83, name: "Yak", class: "Mammal", diet: "Herbivore" },
  { id: 84, name: "Musk Ox", class: "Mammal", diet: "Herbivore" },
  { id: 85, name: "Reindeer", class: "Mammal", diet: "Herbivore" },
  { id: 86, name: "Moose", class: "Mammal", diet: "Herbivore" },
  { id: 87, name: "Elk", class: "Mammal", diet: "Herbivore" },
  { id: 88, name: "Deer", class: "Mammal", diet: "Herbivore" },
  { id: 89, name: "Caribou", class: "Mammal", diet: "Herbivore" },
  { id: 90, name: "Antelope", class: "Mammal", diet: "Herbivore" },
  { id: 91, name: "Gazelle", class: "Mammal", diet: "Herbivore" },
  { id: 92, name: "Impala", class: "Mammal", diet: "Herbivore" },
  { id: 93, name: "Kudu", class: "Mammal", diet: "Herbivore" },
  { id: 94, name: "Springbok", class: "Mammal", diet: "Herbivore" },
  { id: 95, name: "Wildebeest", class: "Mammal", diet: "Herbivore" },
  { id: 96, name: "Zebu", class: "Mammal", diet: "Herbivore" },
  { id: 97, name: "Yak", class: "Mammal", diet: "Herbivore" },
  { id: 98, name: "Musk Ox", class: "Mammal", diet: "Herbivore" },
  { id: 99, name: "Reindeer", class: "Mammal", diet: "Herbivore" },
  { id: 100, name: "Moose", class: "Mammal", diet: "Herbivore" },
]

export function ComboTableUseCase() {
  const [selectedItem, setSelectedItem] = useState<Animal | undefined>(
    undefined
  )
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">Combo Table</h2>
      <p className="text-sm text-gray-500">
        A ComboBox whose popover is rendered as a table with tanstack table and
        react-aria virtual.Uses semantic HTML table
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
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.class}</TableCell>
              <TableCell>{item.diet}</TableCell>
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
