
import type { Metadata } from 'next'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'


/**
 * This Auth Layout is located in ./(auth). Any applied code here applies the theme to its adjacent folders with <route-name>/page.tsx. 
 * For example, if the html is designed where the color is set as red, then the theme applies to any of the components <route-name>/page.tsx. as long as the parent directory (organizational folder) has a <(folder name)>.
 * @param param0 
 * @returns 
 */
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return ( 
        //wrap with ClerkProvider so that user is able to be redirected to the sign-in page
        <ClerkProvider afterSignOutUrl={"/"}>
        <div className="h-full flex items-center justify-center">
            
        
            { children }
        
        </div>
        </ClerkProvider>
     );
}
 
export default AuthLayout;