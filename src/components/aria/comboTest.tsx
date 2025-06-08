import { ComboListUseCase } from "../ui/comboList/ComboListUseCase"
import { ComboTableUseCase } from "../ui/comboTable/ComboTableUseCase"
import { ComboTableUseCase as V2ComboTableUseCase } from "../ui/v2comboTable/ComboTableUseCase"
import { ComboTableUseCase as V3ComboTableUseCase } from "../ui/v3comboTable/ComboTableUseCase"

export function ComboTest() {
  return (
    <div>
      <ComboListUseCase />
      <ComboTableUseCase />
      <V2ComboTableUseCase />
      <V3ComboTableUseCase />
    </div>
  )
}
