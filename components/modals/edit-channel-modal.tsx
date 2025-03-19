"use client";
import qs from "query-string";
import axios from "axios"
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,

} from "@/components/ui/select";

//5:05:17


import {
    Dialog,
    DialogContent,
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
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { ChannelType } from "@prisma/client";
import { useEffect } from "react";


//create form schema for naming the channel.
//validate name by having a minimum character count of 1 and exclude the name "general" as a text input
const formSchema = z.object({
    name: z.string().min(1, {
        message: "Channel name is required."
    }).refine(
        name => name !== "general",
        {
            message: "Channel name cannot be 'general"
        }
            
    ),
    type: z.nativeEnum(ChannelType),
    
});

export const EditChannelModal = () => {
    //define Modal Store here for server-related modifications:
    const { isOpen, onClose, type, data } = useModal();
    //define router for navigating through pages (url)
    const params = useParams();
    const router = useRouter();

    //check to see if modal is open and user is attempting to create a server
    const isModalOpen = isOpen && type === "editChannel";
    const { server, channel } = data;
    const channelType = channel?.type;

    /**
     * Create a form that uses zod resolver (schema validation with static type infeference)
     * and its default values as empty
     */
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name:"",
            type: channel?.type || ChannelType.TEXT,           
        }
    })

    //add useEffect for when user clicks editing a specific channel (x channel + button)
    useEffect(() => {
        if (channel){
            form.setValue("name", channel.name)
            form.setValue("type", channel.type)
        }
        

    },[channelType, form])

    //create variable when page is loading
    const isLoading = form.formState.isSubmitting;
    //create event handler when user submits form
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id
                }

            })
            await axios.patch(url, values);       //cast POST request and send values to endpoint
                                                            // /api.servers
            form.reset();                                   //reset form
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
                        Edit Channel
                    </DialogTitle>

                </DialogHeader>
                
                <Form {...form}>
                    
                    <form onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8">
                    <div className="space-y-8 px-6">
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({ field }) =>(
                            <FormItem>
                                <FormLabel
                                    className="uppercase text-xs font-bold text-zinc-500 dark:text-[#646D6E]"
                                >
                                    Channel Name


                                </FormLabel>
                                <FormControl>
                                    {/* dark:bg-zinc-900 text-black dark:text-white */}
                                    <Input
                                        type="text"
                                        disabled={isLoading}
                                        className="bg-zinc-500/50 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                                        placeholder="Enter channel name"
                                        {...field}
                                    />


                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            
                            
                            )}
                        
                        />
                        {/**New form field for selecting channel type */}
                        <FormField 
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel
                                        className="font-bold uppercase text-xs text-zinc-500 dark:text-[#646D6E]"
                                    >Channel Type</FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger
                                                className="bg-zinc-300/50 w-[465px] border-0 focus:ring-0 text-black dark:text-white ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                                            >
                                                <SelectValue placeholder="Select a channel type" />

                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(ChannelType).map((type) => (
                                                <SelectItem
                                                    key={type}
                                                    value={type}
                                                    className="capitalize text-zinc-500 dark:text-white"
                                                >
                                                    {type.toLowerCase()}

                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
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