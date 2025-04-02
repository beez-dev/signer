import {FileInput} from "@/components/FileInput";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start p-4">
        <div className="h-[500px] w-[1200px] border-4 border-dotted border-gray-400 hover:border-gray-600 rounded-lg text-center flex items-center justify-center">
            <FileInput />
        </div>
      </main>
    </div>
  );
}
