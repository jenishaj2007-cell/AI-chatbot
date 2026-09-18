import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { UploadedDocument, DocType } from '../types/contract';

// Configure PDF.js worker
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();
} catch (e) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.0.379'}/build/pdf.worker.min.mjs`;
}

function detectDocType(fileName: string, text: string): DocType {
  const lower = (fileName + ' ' + text.slice(0, 1000)).toLowerCase();
  if (lower.includes('policy') || lower.includes('standard operating procedure') || lower.includes('guidelines') || lower.includes('corporate policy')) {
    return 'Company Policy';
  }
  if (lower.includes('regulation') || lower.includes('directive') || lower.includes('gdpr') || lower.includes('statute') || lower.includes('act of')) {
    return 'Regulation / Law';
  }
  if (lower.includes('terms and conditions') || lower.includes('terms of service') || lower.includes('terms of use')) {
    return 'Terms & Conditions';
  }
  if (lower.includes('non-disclosure') || lower.includes('nda') || lower.includes('confidentiality agreement') || lower.includes('memorandum of understanding')) {
    return 'Agreement';
  }
  return 'Contract';
}

/**
 * Parses a single file (PDF, DOCX, TXT) and returns an UploadedDocument with extracted text and page count.
 */
export async function parseDocument(
  file: File,
  index: number = 0,
  onProgress?: (pct: number, stage: string) => void
): Promise<UploadedDocument> {
  const fileName = file.name;
  const lowerName = fileName.toLowerCase();

  // 1. Text or Markdown files
  if (lowerName.endsWith('.txt') || lowerName.endsWith('.md')) {
    onProgress?.(50, `Reading text document ${fileName}...`);
    const text = await file.text();
    const docType = detectDocType(fileName, text);
    onProgress?.(100, `Completed ${fileName}`);
    return {
      id: `doc-${Date.now()}-${index}`,
      name: fileName,
      docType: docType,
      pageCount: Math.max(1, Math.ceil(text.split('\n').length / 45)),
      sizeBytes: file.size,
      extractedText: text.trim(),
    };
  }

  // 2. DOCX Word documents
  if (lowerName.endsWith('.docx')) {
    onProgress?.(30, `Parsing Word document ${fileName}...`);
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value.trim();
    const docType = detectDocType(fileName, text);
    onProgress?.(100, `Completed ${fileName}`);
    return {
      id: `doc-${Date.now()}-${index}`,
      name: fileName,
      docType: docType,
      pageCount: Math.max(1, Math.ceil(text.split('\n').length / 40)),
      sizeBytes: file.size,
      extractedText: text,
    };
  }

  // 3. PDF documents
  onProgress?.(20, `Loading PDF ${fileName}...`);
  const arrayBuffer = await file.arrayBuffer();

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true,
  });

  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;
  const pageTexts: string[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const pageProgress = Math.round(20 + ((pageNum / numPages) * 75));
    onProgress?.(pageProgress, `Extracting page ${pageNum}/${numPages} from ${fileName}...`);

    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageString = textContent.items
      .map((item: any) => item.str || '')
      .join(' ')
      .replace(/\s+/g, ' ');

    pageTexts.push(`[Page ${pageNum}]\n${pageString}`);
  }

  const fullText = pageTexts.join('\n\n').trim();
  const docType = detectDocType(fileName, fullText);

  onProgress?.(100, `Extraction complete for ${fileName}`);
  return {
    id: `doc-${Date.now()}-${index}`,
    name: fileName,
    docType: docType,
    pageCount: numPages,
    sizeBytes: file.size,
    extractedText: fullText,
  };
}

/**
 * Parses 1, 2, or 3 files simultaneously.
 */
export async function parseMultipleDocuments(
  files: File[],
  onProgress?: (totalPct: number, currentFileStage: string) => void
): Promise<UploadedDocument[]> {
  if (files.length === 0) {
    throw new Error('Please select at least 1 document to upload.');
  }
  if (files.length > 3) {
    throw new Error('Maximum 3 documents can be uploaded simultaneously.');
  }

  const results: UploadedDocument[] = [];
  const totalFiles = files.length;

  for (let i = 0; i < totalFiles; i++) {
    const file = files[i];
    const doc = await parseDocument(file, i, (pct, stage) => {
      const overall = Math.round(((i / totalFiles) * 100) + (pct / totalFiles));
      onProgress?.(overall, stage);
    });
    results.push(doc);
  }

  return results;
}
