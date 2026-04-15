import { Categories } from "../../components/category/Categories";
import HeroSection from "../../components/HeroSection";
import { HomePageFeaturedProperties } from "../../components/properties/HomePageFeatureProperties";
import RecentListings from "../../components/properties/RecentListings";



export default async function Home(){
  console.log("Rendering Home Page at", new Date().toISOString());
  return <div>
    <HeroSection/>
    <HomePageFeaturedProperties/>
    <Categories/>
    <RecentListings/>
   
  </div>
}