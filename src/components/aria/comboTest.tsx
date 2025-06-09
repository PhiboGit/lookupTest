import { ComboListUseCase } from "../ui/comboList/ComboListUseCase"
import { ComboTableUseCase } from "../ui/comboTable/ComboTableUseCase"
import { ComboTableUseCase as V2ComboTableUseCase } from "../ui/v2comboTable/ComboTableUseCase"
import { ComboTableUseCase as V3ComboTableUseCase } from "../ui/v3comboTable/ComboTableUseCase"
import { ComboTableUseCase as V4ComboTableUseCase } from "../ui/v4comboTable/ComboTableUseCase"
import { ComboTableUseCase as V5ComboTableUseCase } from "../ui/v5comboTable/ComboTableUseCase"
import { ComboTableUseCase as V6ComboTableUseCase } from "../ui/v6comboTable/ComboTableUseCase"
import { ComboTableUseCase as V7ComboTableUseCase } from "../ui/v7comboTable/ComboTableUseCase"
import { ComboTableUseCase as V8ComboTableUseCase } from "../ui/v8comboTable/ComboTableUseCase"

export function ComboTest() {
  return (
    <div>
      <ComboListUseCase />
      <ComboTableUseCase />
      <V2ComboTableUseCase />
      <V3ComboTableUseCase />
      <V4ComboTableUseCase />
      <V5ComboTableUseCase />
      <V6ComboTableUseCase />
      <V7ComboTableUseCase />
      <V8ComboTableUseCase />
    </div>
  )
}
