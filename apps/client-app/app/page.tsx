import { authOptions } from "@repo/auth-config"
import { getServerSession } from "next-auth"
import VideoBackground from "../components/VideoBackground";
import Footer from "../components/Footer";


export default async function Home(){
  return <div>
    <VideoBackground/>
    <Footer/>
  </div>
}