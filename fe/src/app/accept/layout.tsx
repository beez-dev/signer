'use client';

import {Suspense} from "react";

export default function AcceptLayout({
                                         children,
                                     }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Suspense>
            {children}
        </Suspense>
    );
}