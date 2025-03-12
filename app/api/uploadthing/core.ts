import { auth } from '@clerk/nextjs/server'

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function
const handleAuth = async () => {
    const { userId } = await auth();
    if(!userId) throw new Error("Unauthorized");
    return { userId: userId };
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    //case for uploading server image:
    serverImage: f({ image: {maxFileSize: "4MB", maxFileCount: 1} })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
    //case for uploading message file
    messageFile: f(["image", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {})
 
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
