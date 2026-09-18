import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();
} catch (e) {
  // Fallback to unpkg/cdnjs if URL resolution fails
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.0.379'}/build/pdf.worker.min.mjs`;
}

export interface ExtractedDocument {
  name: string;
  pageCount: number;
  text: string;
  sizeBytes: number;
}

/**
 * Extracts plain text from a user-uploaded PDF or text file.
 */
export async function extractTextFromFile(
  file: File,
  onProgress?: (progress: number, stage: string) => void
): Promise<ExtractedDocument> {
  const fileName = file.name.toLowerCase();

  // If it's a plain text or markdown file, read directly
  if (fileName.endsWith('.txt') || fileName.endsWith('.md')) {
    onProgress?.(50, 'Reading text document...');
    const text = await file.text();
    onProgress?.(100, 'Text extracted successfully.');
    return {
      name: file.name,
      pageCount: 1,
      text: text.trim(),
      sizeBytes: file.size,
    };
  }

  // Handle PDF files
  onProgress?.(10, 'Loading PDF document into memory...');
  const arrayBuffer = await file.arrayBuffer();

  onProgress?.(25, 'Initializing PDF parser engine...');
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true,
  });

  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;
  const pageTexts: string[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const progressPercent = Math.round(25 + ((pageNum / numPages) * 65));
    onProgress?.(progressPercent, `Extracting text from page ${pageNum} of ${numPages}...`);

    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();

    // Combine strings with spacing
    const pageString = textContent.items
      .map((item: any) => item.str || '')
      .join(' ')
      .replace(/\s+/g, ' ');

    pageTexts.push(`--- Page ${pageNum} ---\n${pageString}`);
  }

  onProgress?.(95, 'Structuring extracted document content...');
  const fullText = pageTexts.join('\n\n').trim();

  if (!fullText || fullText.length < 50) {
    throw new Error(
      'Could not extract sufficient text from this PDF. Please ensure the document is not an image-only scanned scan without OCR.'
    );
  }

  onProgress?.(100, 'Extraction complete!');
  return {
    name: file.name,
    pageCount: numPages,
    text: fullText,
    sizeBytes: file.size,
  };
}
