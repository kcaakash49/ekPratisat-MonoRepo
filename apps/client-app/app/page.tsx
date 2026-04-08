
import VideoBackground from "../components/VideoBackground";
import Footer from "../components/Footer";
import { Categories } from "../components/category/Categories";


export default async function Home(){
  console.log("Rendering Home Page at", new Date().toISOString());
  return <div>
    <VideoBackground/>
    <Categories/>
    <Footer/>
  </div>
}