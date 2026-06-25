"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  
  // Isolate admin dashboard and login pages from retail layout
  const isDashboardOrAdmin = pathname?.startsWith('/admin') || pathname?.startsWith('/login');

  return (
    <>
      {!isDashboardOrAdmin && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isDashboardOrAdmin && <Footer />}
    </>
  );
}
