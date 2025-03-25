"use client"

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"

const io = require("socket.io-client");
import { Server } from "socket.io"

type SocketContextType = {
    socket: any | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { 
    
    children: React.ReactNode

}) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        console.log(process.env.NEXT_PUBLIC_SITE_URL!);
        //by default,  is pointed to localhost 
        const socketInstance = new (io as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
            path: "/api/socket/io",

            addTrailingSlash: false,

        });

        //output error message when connection to socket is not established
        socketInstance.on("connect_error", (error: { message: any; description: any; context: any; }) => {
            // the reason of the error, for example "xhr poll error"
            console.log(error.message);
          
            // some additional description, for example the status code of the initial HTTP response
            console.log(error.description);
          
            // some additional context, for example the XMLHttpRequest object
            console.log(error.context);
          });

        socketInstance.on("connect", () => {
            setIsConnected(true);
        })

        socketInstance.on("disconnect", () => {
            setIsConnected(false);
        })

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        }

    },[])

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    )

}