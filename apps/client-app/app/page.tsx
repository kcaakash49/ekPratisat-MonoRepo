import { ToggleTheme } from "@repo/ui/themeToggle";


export default function Home (){
  return (
    <div className="text-4xl text-pink-600">
        I am CLient
        <ToggleTheme/>
    </div>
  )
}