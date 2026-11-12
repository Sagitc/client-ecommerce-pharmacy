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
                refetchOnMount: false,
                refetchOnReconnect: false,
                staleTime: 1000 * 60 * 5, // 5 minutos de cache padrão
                gcTime: 1000 * 60 * 10,   // 10 minutos de retenção
                retry: 1,
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