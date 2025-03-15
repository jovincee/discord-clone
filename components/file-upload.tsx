"use client";

// import "@/app/globals.css";


import { UploadDropzone } from "@/lib/uploadthing";
import { X } from "lucide-react";
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
    console.log(`value: ${value}, ${fileType}`)
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