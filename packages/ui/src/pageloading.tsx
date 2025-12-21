import AnimateLoader from "./animateLoader";

export default function PageLoading(){
    return (
        <div className="flex flex-1 items-center justify-center h-full">
            <AnimateLoader />
        </div>
    );
}