/**
 * This is the file that creates the main layout. 
 * 1. Create a component that creates space 72 pixels horizontally to the left (from the left
 * side of the screen)
 * 
 * @param param0 
 * 
 * 
 * @returns 
 */

import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";

const MainLayout = async ({
    children
}: {
    children: React.ReactNode;


}) => {
    return (
        <div className="h-full">
            <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
                <NavigationSidebar />
            </div>
            <main className="md:pl-[72px] h-full">
                {children}
            </main>
        </div>
    )

}

export default MainLayout;