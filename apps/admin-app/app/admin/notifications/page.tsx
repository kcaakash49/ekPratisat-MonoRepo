"use client";

import { useGetNotifications } from "@repo/query-hook";
import AnimateLoader from "@repo/ui/animateLoader";
import NotificationRenderList from "../../../components/Notification/NotificationRenderlist";

export default function NotificationPage(){
    const {data, isLoading, isError, error} = useGetNotifications();

    if (isLoading) {
        return (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <AnimateLoader />
          </div>
        );
      }
    
      if (isError) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">{error.message}</div>
      }

      console.log(data);

      return (
        <>
            <NotificationRenderList notifications={data.result}/>
        </>
      )
}