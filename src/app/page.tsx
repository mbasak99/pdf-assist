"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
import { ChatHistory } from "@/types/chat";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { Document, Page, pdfjs } from "react-pdf";

export default function Home() {
  const [isFileTooLarge, setIsFileTooLarge] = useState<boolean>(false);
  const [uploadedPDF, setUploadedPDF] = useState<File | null>(null);
  const [pgNum, setPgNum] = useState<number>(1);
  const [maxPDFPages, setMaxPDFPages] = useState<number>(1);
  const [userPgNum, setUserPgNum] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);

  const pdfDropHandler = (file: File) => {
    if (file.size > 100_000_000) {
      setIsFileTooLarge(true);
      return;
    } else if (file.type === "application/pdf") {
      setUploadedPDF(file);
    }
  };

  const onDocSuccess = (pdf: any) => {
    setMaxPDFPages(pdf.numPages);
    toast({
      title: "Successfully loaded PDF.",
      duration: 1500,
    });
  };

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  }, []);

  useEffect(() => {
    console.log(uploadedPDF);
  }, [uploadedPDF]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-row gap-8 row-start-2 items-center sm:items-start">
        {!uploadedPDF ? (
          <div>
            <FileUploader
              handleChange={pdfDropHandler}
              name="upload-pdf"
              types={["PDF"]}
              className="test"
            />
          </div>
        ) : (
          <div
            // animate={{ x: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "linear" }}
            className="flex flex-col items-center gap-2"
          >
            <Document file={uploadedPDF} onLoadSuccess={onDocSuccess}>
              <Page
                pageNumber={pgNum}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
            <span className="flex gap-10">
              <Button
                size="icon"
                onClick={() => {
                  if (pgNum > 1) {
                    setPgNum(pgNum - 1);
                  }
                }}
              >
                <ChevronLeft />
              </Button>
              <div className="flex flex-col items-center gap-2">
                <Input
                  className="w-20 text-center"
                  type="text"
                  value={pgNum ?? 1}
                  onChange={(event: any) => {
                    console.log(event);
                    const userVal = Number(event.nativeEvent.data);
                    if (!isNaN(userVal)) {
                      setPgNum(userVal);
                    }
                  }}
                />
                <Button>Go</Button>
              </div>
              <Button
                size="icon"
                onClick={() => {
                  if (pgNum < maxPDFPages) {
                    setPgNum(pgNum + 1);
                  }
                  console.log(pgNum, maxPDFPages);
                }}
              >
                <ChevronRight />
              </Button>
            </span>
          </div>
        )}
        {uploadedPDF ? (
          <div className="flex flex-row gap-4 flex-end self-end text-black">
            {/* TODO: Chat Log Here */}
            <Input type="text" placeholder="Enter your questions here" />
            <Button
              type="submit"
              onClick={(event) => {
                console.log(event);
              }}
            >
              Send
            </Button>
          </div>
        ) : null}
      </main>
      <Toaster />
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <b>PDF Assist</b>Made by Monark
      </footer>
    </div>
  );
}
