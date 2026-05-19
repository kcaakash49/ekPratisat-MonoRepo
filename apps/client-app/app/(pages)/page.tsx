import { Categories } from "../../components/category/Categories";
import HeroSection from "../../components/HeroSection";
import { HomePageFeaturedProperties } from "../../components/properties/HomePageFeaturedProperties";
import RecentListings from "../../components/properties/RecentListings";



export default async function Home(){
  return <div>
    <HeroSection/>
    <HomePageFeaturedProperties/>
    <Categories/>
    <RecentListings/>
   
  </div>
}