import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { getInitialUser } from "../../utils/getInitialUser";


export default async function Layout({children} : {children: React.ReactNode}){
    const initialUser = await getInitialUser();

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar initialUser={initialUser}/>
            <main className="flex-1">
                {children}
            </main>
            <Footer/>
        </div>
    )
}
