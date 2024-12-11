"use client";

import { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { Document, Page, pdfjs } from "react-pdf";

export default function Home() {
  const [isFileTooLarge, setIsFileTooLarge] = useState<boolean>(false);
  const [uploadedPDF, setUploadedPDF] = useState<File | null>(null);
  const [pgNum, setPgNum] = useState<number>(1);

  const pdfDropHandler = (file: File) => {
    if (file.size > 100_000_000) {
      setIsFileTooLarge(true);
      return;
    } else if (file.type === "application/pdf") {
      setUploadedPDF(file);
    }
  };

  const onDocSuccess = (pdf: any) => {
    setPgNum(pdf.numPages);
  };

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-row gap-8 row-start-2 items-center sm:items-start">
        {/* <div id="pdf-drop-zone" onDrop={pdfDropHandler}>
          <p>
            <i>Drag and drop PDF file here.</i>
          </p>
        </div> */}
        {!uploadedPDF ? (
          <FileUploader
            handleChange={pdfDropHandler}
            name="upload-pdf"
            types={["PDF"]}
            className="test"
          />
        ) : (
          <div>
            <Document file={uploadedPDF} onLoadSuccess={onDocSuccess}>
              <Page pageNumber={pgNum} />
            </Document>
          </div>
        )}
        <div className="flex flex-row gap-4">
          <input
            onSubmit={() => {
              console.log("test");
            }}
            type="text"
            name="Chat to Assistant"
            id="pdf-chat"
          />
          <button type="submit">Submit</button>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <b>PDF Assist</b>Made by Monark
      </footer>
    </div>
  );
}
