
import { AddPropertyForm } from "@repo/components/addPropertyForm";

export default async function AddProperty() {
  return (
    <div className="px-4">
      <div className="w-full max-w-7xl mx-auto ">
        <AddPropertyForm user="client" />
      </div>
    </div>
  )
}