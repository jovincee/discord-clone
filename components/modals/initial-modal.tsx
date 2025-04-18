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
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { useRouter } from "next/navigation";

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

export const InitialModal = () => {
    const [isMounted, setIsMounted] = useState(false);

    const router = useRouter();

    //apply useEffect hook here to set the page to be mounted, stating that
    //components are created and inserted in the DOM (document object model)
    useEffect(() => {
        setIsMounted(true)
    },[]);

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

    //create variable when page is loading
    const isLoading = form.formState.isSubmitting;
    //create event handler when user submits form
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            console.log(values);
            await axios.post("/api/servers", values);       //cast POST request and send values to endpoint
                                                            // /api.servers
            form.reset();                                   //reset form
            router.refresh();                               //refresh router and reload window
            window.location.reload();
            
        } catch (error){
            console.log(error)
        }
    }

    if(!isMounted){
        return null;
    }

    return (
      
        <Dialog open>
            <DialogContent
                className="bg-white text-black 
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
                                    className="uppercase text-xs font-bold text-zinc-500
                                    dark:text-secondary/70"
                                >
                                    Server Name


                                </FormLabel>
                                <FormControl>
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
                    <DialogFooter className="bg-gray-100 px-6 py-4">
                        <Button 
                        variant="primary"
                        disabled={isLoading}
                            
                        >
                            Create

                        </Button>

                    </DialogFooter>

                    </form>

                </Form>

            </DialogContent>
        </Dialog>
   

    )
}