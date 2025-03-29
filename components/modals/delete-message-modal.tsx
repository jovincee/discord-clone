"use client";


import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";



import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import qs from "query-string";
import { useState } from "react";
import axios from "axios";
import { DialogDescription } from "@radix-ui/react-dialog";



export const DeleteMessageModal = () => {
    //define Modal Store here for server-related modifications:
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const [isLoading, setIsLoading] = useState(false);




    //check to see if modal is open and user is trying to delete message
    const isModalOpen = isOpen && type === "deleteMessage";
    

    
    const { apiUrl, query } = data;

    //create onClick event handler here for deleting the message
    const onClick = async () => {
        try{
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query,
            })

            

            await axios.delete(url);

            onClose();


        } catch (error){
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }

    

    //add use modal hook here:
    return (
        //The dialog component handles an open event and an onOpenChange (when user closes the modal screen)
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent
                className="bg-white dark:bg-[#303237] text-black 
                p-0 overflow-hidden"
            >
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center text-black dark:text-gray-100">
                        Delete Message
                    </DialogTitle>
                    <DialogDescription className="text-center text-black dark:text-zinc-500">
                        Are you sure you want to delete this message? This message will be permanently deleted.
                    </DialogDescription>
                    <DialogDescription className="text-center font-semibold text-red-500">
                        Doing this will permanently delete the message.
                    </DialogDescription>
                    
                </DialogHeader>
                <DialogFooter className="bg-white dark:bg-[#35373d] px-6 py-4">
                    <div className="flex items-center bg-white dark:bg-[#35373d] justify-between w-full">
                        <Button
                            className="cursor-pointer bg-zinc-300 dark:bg-zinc-600"
                            disabled={isLoading}
                            onClick={onClose}
                            variant="ghost"                        
                        >
                            Cancel
                        </Button>
                        <Button
                            className="cursor-pointer"
                            disabled={isLoading}
                            onClick={onClick}
                            variant="primary"                        
                        >
                            Confirm
                        </Button>

                    </div>

                </DialogFooter>
            </DialogContent>
        </Dialog>
   

    )
}