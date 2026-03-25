import { AddPropertyForm } from "@repo/components/addPropertyForm";



export default async function AddProperty() {
    
    const user = "admin"

    return (
        <AddPropertyForm user={user}/>
    )
}