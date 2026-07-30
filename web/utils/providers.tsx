"use client"

import { 
    ReactNode, 
    useState 
} from "react";
import { 
    QueryClient, 
    QueryClientProvider 
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { UserProvider } from "@/contexts/user-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

export default function Providers({ children }: { children: ReactNode }) {

    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false, 
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <UserProvider>
                    <TooltipProvider>
                        {children}
                        <Toaster />
                        {/* <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-right" /> */}
                    </TooltipProvider>
                </UserProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}