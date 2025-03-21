import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

//export default clerkMiddleware();

const isPublicRoute = createRouteMatcher(["/api/uploadthing"])

const serverChange = createRouteMatcher(["/servers/"])

const MAX_ARR = 2;

//initial route when user changes server
function checkServerChanged(req: string){
  const strArr = req.split("/");

  if (strArr.length === MAX_ARR){
    console.log("server changed")
  }
}



const isProtectedRoute = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, req) => {
  const userAgent = req.headers.get('user-agent')?.toLowerCase();
  const isBot = userAgent?.includes('bot') ?? false;



  //**
  //    Check when server is being rendered (loading state)
  //  */

  if (serverChange(req)){
    console.log("serverChange")
  }


  checkServerChanged(req.url);

  // Prevent bot activity by routing bots to a special detection page
  if (isBot) {
    return NextResponse.rewrite(new URL('/bot-detection', req.url));
  }

  if (isProtectedRoute(req) && !isPublicRoute(req)) await auth.protect();
  
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/"],
};

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// };