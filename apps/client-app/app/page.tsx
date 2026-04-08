
import VideoBackground from "../components/VideoBackground";
import Footer from "../components/Footer";
import { Categories } from "../components/category/Categories";


export default async function Home(){
  
  return <div>
    <VideoBackground/>
    <Categories/>
    <Footer/>
  </div>
}