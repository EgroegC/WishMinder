import { SidebarProvider } from '@/components/ui/sidebar.tsx';
import { AppSidebar } from './AppSideBar.tsx';
import '../../index.css';
import NavBar from './NavBar.tsx';
import { type ReactNode } from 'react';

type Props = {
    children: ReactNode;
};

export default function AppLayout({ children }: Props) {
    return (
        <div >
            <SidebarProvider >
                <AppSidebar />
                <main className='w-full'>
                    <NavBar />
                    <div className='px-4'>{children}</div>
                </main>
            </SidebarProvider>
        </div>
    );
}
