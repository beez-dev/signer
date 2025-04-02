'use client';

import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {uploadFile} from "@/lib/services/file";
import React, {useCallback, useState} from "react";


export function FileInput() {
    const [uploadState, setUploadState] = useState(false);

    const uploadFileCallback = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        // Simple implementation to indicate uploading state
        setUploadState(true);
        await uploadFile(e);
        setUploadState(false)
    }, [])

    return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="file-upload" className="text-xl">Start by uploading a file</Label>
            <Input id="file-upload" type="file" className="mt-1 cursor-pointer" placeholder={"select files"}
                   multiple={false} onChange={uploadFileCallback}/>
            <div className="text-gray-600">
                {uploadState ? 'Uploading...' : ''}
            </div>
        </div>
    )
}
