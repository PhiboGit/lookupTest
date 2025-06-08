import "./App.css"
import { ComboTest } from "./components/aria/comboTest"
import { TestAdornment } from "./storybook/adormment.stories"

function App() {
  return (
    <>
      {/* <MyTableComponent /> */}
      {/* <MyDataGrid /> */}
      <TestAdornment />
      <ComboTest />
      <div style={{ height: "100vh" }}></div>
    </>
  )
}

export default App
