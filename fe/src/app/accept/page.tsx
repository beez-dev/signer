'use client';

import {Spinner} from "@/components/ui/spinner";
import React, {useEffect, useState} from "react";
import {useSearchParams} from 'next/navigation';
import {acceptInvite} from "@/lib/services/file";

export default function Page() {

    const searchParams = useSearchParams();
    const pathId = searchParams.get('pathId');
    const token = searchParams.get('token');
    const [isAccepting, setIsAccepting] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (pathId && token) {
            setIsAccepting(true);
            acceptInvite(pathId, token).then(() => setIsAccepting(false)).catch(() => {
                setIsAccepting(false)
                setIsError(true);
            });
        }
    }, [])


    if (!(pathId && token)) {
        return <div className="text-3xl">Invalid access</div>
    }

    if (isAccepting) {
        return <div className="flex flex-row items-center justify-center gap-x-4 text-3xl">
            <div className="text-2xl">Uploading documents...</div>
            <Spinner size="sm"
                     className="bg-black dark:bg-white"/></div>
    }

    if (isError) {
        return <div className="flex flex-col items-center justify-center gap-y-4">
            <div className="text-xl">Error. Please check the link and try again (Validity to accept is within 60
                minutes).
            </div>
            <h3>Note that the link cannot be accepted twice.</h3>
        </div>
    }


    return <h2 className="text-3xl">Congratulations!! You have accepted the submission.</h2>
}