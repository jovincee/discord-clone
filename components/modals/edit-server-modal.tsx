"use client";
import axios from "axios"
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";



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
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect } from "react";

//create form schema for storing the server name info and 
//the server image url
const formSchema = z.object({
    name: z.string().min(1, {
        message: "Server name is required."
    }),
    imageUrl: z.string().min(1, {
        message: "Server image is required."
    })
})

export const EditServerModal = () => {
    //define Modal Store here for server-related modifications:
    const { isOpen, onClose, type, data } = useModal();
    //define router for navigating through pages (url)
    const router = useRouter();
    

    //check to see if modal is open and user edits a server
    const isModalOpen = isOpen && type === "editServer";
    const { server } = data;

    /**
     * Create a form that uses zod resolver (schema validation with static type infeference)
     * and its default values as empty
     */
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name:"",
            imageUrl: "",
        }
    })

    useEffect(() => {
        //check if server exists:
        
        if(server) {
            
            form.setValue("name", server.name);
            form.setValue("imageUrl", server.imageUrl);
        }
    },[server, form])

    console.log("exists");
    console.log(server?.name, server?.imageUrl);

    //create variable when page is loading
    const isLoading = form.formState.isSubmitting;
    //create event handler when user submits form
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            
            await axios.patch(`/api/servers/${server?.id}`, values);       //cast POST request and send values to endpoint
                                                            // /api.servers
            router.refresh();                               //refresh router and reload window
            onClose();
       
            
        } catch (error){
            console.log(error)
        }
    }



    //create an event handler here when dialog is closed by the user:
    const handleClose = () => {
        
        onClose();      //closes the state obtained from useModalStore hook
    }


    //add use modal hook here:
    return (
        //The dialog component handles an open event and an onOpenChange (when user closes the modal screen)
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent
                className="bg-white dark:bg-[#303237] text-black dark:text-gray-100
                p-0 overflow-hidden"
            >
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Customize your server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Give your server a personality with a name and
                        an image. You can always change it later.
                    </DialogDescription>


                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8">
                    <div className="space-y-8 px-6">
                        <div className="flex items-center justify-center text-center">
                            <FormField
                                control={form.control}
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUpload 
                                                endpoint="serverImage"
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            
                            
                            
                            />
                        </div>

                        <FormField 
                            control={form.control}
                            name="name"
                            render={({ field }) =>(
                            <FormItem>
                                <FormLabel
                                    className="uppercase text-xs font-bold text-zinc-500 dark:text-[#646D6E]"
                                >
                                    Server Name


                                </FormLabel>
                                <FormControl>
                                    {/* dark:bg-zinc-900 text-black dark:text-white */}
                                    <Input
                                        disabled={isLoading}
                                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                        placeholder="Enter server name"
                                        {...field}
                                    />


                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            
                            
                            )}
                        
                        />
                    </div>
                    <DialogFooter className="bg-gray-100 dark:bg-[#303237] px-6 py-4">
                        <Button 
                        variant="primary"
                        disabled={isLoading}
                            
                        >
                            Save

                        </Button>

                    </DialogFooter>

                    </form>

                </Form>

            </DialogContent>
        </Dialog>
   

    )
}