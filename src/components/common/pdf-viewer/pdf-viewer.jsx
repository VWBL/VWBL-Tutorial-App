import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, HStack, Text } from '@chakra-ui/react';
import { Document, Page, pdfjs } from 'react-pdf';
import { usePdfViewer } from '../../../hooks/pdf-viewer';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

/**
 * PdfViewer Component
 * @param {*} param0 
 * @returns 
 */
export const PdfViewer = ({ fileUrl }) => {
  const { numPages, pageNumber, onDocumentLoadSuccess, onClickNextPage, onClickPreviousPage, targetRef, width } = usePdfViewer();

  console.log("fileUrl:", fileUrl);

  return (
    <Box w='100%' ref={targetRef}>
      <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess} onLoadError={console.error}>
            <Page pageNumber={pageNumber} renderAnnotationLayer={false} renderTextLayer={false} width={width} />
      </Document>
      <HStack justifyContent='center' p={6}>
            <ChevronLeftIcon w={30} h={30} color={pageNumber === 1 ? 'gray' : 'white'} onClick={onClickPreviousPage} />
            <Text color='white' px={10}>
                  Page {pageNumber} of {numPages}
            </Text>
            <ChevronRightIcon w={30} h={30} color={pageNumber === numPages ? 'gray' : 'white'} onClick={onClickNextPage} />
      </HStack>
    </Box>
  );
};