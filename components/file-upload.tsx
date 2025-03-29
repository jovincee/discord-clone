"use client";

// import "@/app/globals.css";


import { UploadDropzone } from "@/lib/uploadthing";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";


// export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
//define props (parameters) here:
interface FileUploadProps {
    onChange: (url?: string) => void
    value: string;
    endpoint: "messageFile" | "serverImage"
}

export const FileUpload = ({
    onChange,
    value,
    endpoint,
}: FileUploadProps) => {
    const fileType = value?.split(".").pop();
    
    if (value && fileType !== "pdf"){
        return (
            <div className="relative h-20 w-20">
                <Image 
                    fill
                    src={value}
                    alt="Upload"
                    className="rounded-full"
                />
                {/**The x button allows for deleting the desired upload image */}
                <button
                    onClick={()=> onChange("")}
                    className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                    type="button"
                
                >
                    
                    <X className="h-4 w-4"/>
                </button>
            </div>
        )
    }

    if (value && fileType === "pdf"){
        return(
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                <a 
                    href={value} 
                    target="_blank"    
                    rel="noopener noreferrer"
                    className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                >
                    {value}
                </a>
                <button
                    onClick={()=> onChange("")}
                    className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
                    type="button"
                
                >
                    
                    <X className="h-4 w-4"/>
                </button>

            </div>

        )
    }
    return (
        <UploadDropzone
            className="bg-slate-300 ut-label:text-black-300 ut-allowed-content:ut-uploading:text-red-300"
            endpoint={endpoint}
            onClientUploadComplete={(res)=>{
                console.log("Uploaded");
                onChange(res?.[0].ufsUrl);
            }}
            onUploadError={(error:Error) => {
                console.log(error);
            }}
        
        />
    )
}