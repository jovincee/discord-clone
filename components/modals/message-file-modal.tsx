"use client";
import axios from "axios"
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
// import "@uploadthing/react/styles.css";


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Form,
    FormControl,
    FormField,
    FormItem,

} from "@/components/ui/form";

import qs from "query-string";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

//create form schema for storing the server name info and 
//the server image url
const formSchema = z.object({
    
    fileUrl: z.string().min(1, {
        message: "Attachment is required."
    })
})

export const MessageFileModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    const { apiUrl, query } = data;

    //used to handle on open states specifically for type "messageFile"
    const isModalOpen = isOpen && type === "messageFile";

    /**
     * Create a form that uses zod resolver (schema validation with static type infeference)
     * and its default values as empty
     */
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: "",
        }
    })

    const handleClose = () => {
        form.reset();
        onClose();
    }

    //create variable when page is loading
    const isLoading = form.formState.isSubmitting;
    //create event handler when user submits form
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query,
            })

            await axios.post(url, {
                ...values,
                content: values.fileUrl
            });       //cast POST request and send values to endpoint
                                                            // /api.servers
            form.reset();                                   //reset form
            router.refresh();                               //refresh router and reload window
            handleClose();                                  
            
        } catch (error){
            console.log(error)
        }
    }


    return (
      
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent
                className="bg-white text-black 
                p-0 overflow-hidden"
            >
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Add an attachment
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Send a file as a message
                    </DialogDescription>


                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8">
                    <div className="space-y-8 px-6">
                        <div className="flex items-center justify-center text-center">
                            <FormField
                                control={form.control}
                                name="fileUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUpload 
                                                endpoint="messageFile"
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            
                            
                            
                            />
                        </div>

                    
                    </div>
                    <DialogFooter className="bg-gray-100 px-6 py-4">
                        <Button 
                        variant="primary"
                        disabled={isLoading}
                            
                        >
                            Send

                        </Button>

                    </DialogFooter>

                    </form>

                </Form>

            </DialogContent>
        </Dialog>
   

    )
}