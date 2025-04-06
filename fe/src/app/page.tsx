'use client';

import {FileInput} from "@/components/FileInput";
import {Input} from "@/components/ui/input";
import {useCallback, useRef, useState} from "react";
import {Button} from "@/components/ui/button";

export default function Home() {

    const [ownerEmail, setOwnerEmail] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    const onStart = useCallback(() => {
        setOwnerEmail(inputRef?.current?.value ?? '')
    }, [])

    return (
        <>
            {!ownerEmail && (<div className="flex flex-col w-1/2 gap-y-2 h-full items-center justify-center">
                {/* Note: Validations are not in place for simplicity*/}
                <Input ref={inputRef}
                       placeholder="Please enter a valid email to start"/>

                <Button className="w-full cursor-pointer" onClick={onStart}>
                    Start uploading documents
                </Button>
            </div>)}

            <FileInput ownerEmail={ownerEmail}/>
        </>
    );
}
