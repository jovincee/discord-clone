import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown } from "lucide-react";

function LoadingInnerPage() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
    //Initial Screen Layout
    <div className="h-full flex flex-row gap-4">
        {/**Skeleton components that appear just on the right of the server sidebar */}
       <div className="flex flex-col gap-4 mt-4 pl-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-100 w-100" />
            
       </div>
        
    </div>
    )
  }

export default LoadingInnerPage;