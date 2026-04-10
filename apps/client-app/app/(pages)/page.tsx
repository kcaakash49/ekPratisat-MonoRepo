import { Categories } from "../../components/category/Categories";
import HeroSection from "../../components/HeroSection";
import RecentListings from "../../components/properties/RecentListings";



export default async function Home(){
  console.log("Rendering Home Page at", new Date().toISOString());
  return <div>
    <HeroSection/>
    <Categories/>
    <RecentListings/>
   
  </div>
}