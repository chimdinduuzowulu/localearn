
export async function extractTextFromFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (ext === "txt" || ext === "md") {
    return readAsText(file);
  }

  if (ext === "pdf") {
    return extractFromPDF(file);
  }

  
  return readAsText(file);
}



function readAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = (e) => resolve((e.target?.result as string) ?? "");
    reader.onerror = () => reject(new Error("Failed to read file as text"));
    reader.readAsText(file, "utf-8");
  });
}



declare global {
  interface Window {
    
    pdfjsLib: any;
  }
}

async function ensurePDFJS(): Promise<void> {
  if (window.pdfjsLib) return;

  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.mjs");

  
  window.pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs";
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) { resolve(); return; }

    const script = document.createElement("script");
    script.src   = src;
    script.type  = "module";
    script.onload  = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

async function extractFromPDF(file: File): Promise<string> {
  try {
    await ensurePDFJS();
  } catch {
    return `[PDF content from "${file.name}" — text extraction requires a network connection to load PDF.js. The file has been saved and will be processed when online.]`;
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pageTexts: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page    = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text    = content.items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => item.str)
      .join(" ");
    pageTexts.push(text);
  }

  return pageTexts.join("\n\n");
}




export function truncateForAI(text: string, maxChars = 32_000): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + "\n\n[Content truncated for processing…]";
}


export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}


export function formatFileSize(bytes: number): string {
  if (bytes < 1024)       return `${bytes} B`;
  if (bytes < 1024 ** 2)  return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}