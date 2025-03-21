import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown } from "lucide-react";

function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
    //Initial Screen Layout
    <div className="h-full flex flex-row gap-4">
        
        <div className="hidden md:flex h-full w-60 z-20 flex-col inset-y-0">
            {/**Initial Server Sidebar layout; add more skeletons here! */}
            <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
                <div>
                {/**Imitate the Dropdown Menu here to keep consistency */}
                <DropdownMenu>
                <DropdownMenuTrigger
                    className="focus:outline-none"
                    asChild
                >
                    
                    <button
                        className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 
                        dark:border-neutral-800 border-b-2"
                    >
                        <Skeleton className="h-4 w-24" />
                        <ChevronDown className="h-5 w-5 ml-auto" />

                    </button>

                </DropdownMenuTrigger>
                </DropdownMenu>
                
                </div>
                
                
            </div>

                
            
        </div>
        {/**Skeleton components that appear just on the right of the server sidebar */}
       <div className="flex flex-col gap-4 mt-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-100 w-100" />

       </div>
        
    </div>
    )
  }

export default Loading;

{/* <div className="flex flex-col  space-y-3">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                    <div className="space-y-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                    </div>
                </div> */}