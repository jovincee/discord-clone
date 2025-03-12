"use client";

import "@uploadthing/react/styles.css";
// import "../styles/globals.css";
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
            </div>
        )
    }
    return (
        <UploadDropzone
            // className="bg-gray-500 ut-upload-icon:text-1g ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300"
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