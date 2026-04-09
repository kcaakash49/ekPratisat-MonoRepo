import { Categories } from "../../components/category/Categories";
import Footer from "../../components/Footer";
import HeroSection from "../../components/HeroSection";
import VideoBackground from "../../components/VideoBackground";

export default async function Home(){
  console.log("Rendering Home Page at", new Date().toISOString());
  return <div>
    <HeroSection/>
    <Categories/>
    <Footer/>
  </div>
}