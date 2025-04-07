import { useEffect, useState } from "react";

type ChatScrollProps = {
    chatRef: React.RefObject<HTMLDivElement>;
    bottomRef: React.RefObject<HTMLDivElement>;
    shouldLoadMore: boolean;
    loadMore: () => void;
    count: number;
}

export const useChatScroll = ({
    chatRef,
    bottomRef,
    shouldLoadMore,
    loadMore,
    count,
} : ChatScrollProps) => {
    const [hasInitialized, setHasInitialized] = useState(false);

    //useEffect for loading top messages
    useEffect(() => {
        const topDiv = chatRef?.current;
        

        //event handler for loading top pages at the top of the scroll
        const handleScroll = () => {
            //get top div component and scroll to top
            const scrollTop = topDiv?.scrollTop;
            //if user is at the top of scroll, trigger load more function
            if (scrollTop === 0 && shouldLoadMore) {
                loadMore()
            }
        };

        topDiv?.addEventListener("scroll", handleScroll);

        return () => topDiv?.removeEventListener("scroll", handleScroll);

    }, [shouldLoadMore, loadMore, chatRef]);

    //useEffect for loading bottom messages
    useEffect(() => {
        const bottomDiv = bottomRef?.current;
        const topDiv = chatRef.current;

        const shouldAutoScroll = () => {
            //if not initialized and user is at bottom div component, set has initialized to true and return true
            if (!hasInitialized && bottomDiv) {
                setHasInitialized(true);
                return true;
            }

            //if top div doesn't exist
            if (!topDiv) {
                return false;
            }

            //calculate distance from bottom page
            const distanceFromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
            return distanceFromBottom <= 100;
        }

        if (shouldAutoScroll()) {
            setTimeout(() => {
                bottomRef.current?.scrollIntoView({
                    behavior: "smooth",
                });
            }, 100)
        }
    }, [bottomRef, chatRef, count, hasInitialized]);


}