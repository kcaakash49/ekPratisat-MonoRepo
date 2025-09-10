import { authOptions } from "@repo/auth-config"
import { getServerSession } from "next-auth"
import VideoBackground from "../components/VideoBackground";
import Footer from "../components/Footer";


export default async function Home(){
  const session = await getServerSession(authOptions);
  console.log(session);
  return <div>
    <VideoBackground/>
    <Footer/>
  </div>
}