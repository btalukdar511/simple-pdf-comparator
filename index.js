import * as pdfjs from 'pdfjs-dist';

async function getPdfInfo(pdfUrl) {
    try {
        const loadingTask = pdfjs.getDocument({ url: pdfUrl, verbosity: 0 });
        const pdf = await loadingTask.promise;

        return pdf;
    } catch (error) {
        console.error('Error getting PDF information:', error);
        return null;
    }
}

async function comparePDFs(file1Url, file2Url) {
    try {
        const pdfInfo1 = await getPdfInfo(file1Url);
        const pdfInfo2 = await getPdfInfo(file2Url);

        if (pdfInfo1.numPages !== pdfInfo2.numPages) {
            console.log('Files are different: Different number of pages');
            return;
        }

        for (let i = 1; i <= pdfInfo1.numPages; i++) {
            const pdf1page = await pdfInfo1.getPage(i);
            const p1TextContent = await pdf1page.getTextContent();
            const p1TextItems = await p1TextContent.items;

            const pdf2page = await pdfInfo2.getPage(i);
            const p2TextContent = await pdf2page.getTextContent();
            const p2TextItems = await p2TextContent.items;

            const pdf1 = p1TextItems.map(item => item.str).join(' ');
            const pdf2 = p2TextItems.map(item => item.str).join(' ');

            if (pdf1 !== pdf2) {
                console.log('Files are different at page', i);
                return;
            }
        }

        console.log('Files are identical');
    } catch (error) {
        console.log(error);
        console.error('Error comparing PDFs:', error.message);
    }
}


const file1Url = '1.pdf';
const file2Url = '2.pdf';

comparePDFs(file1Url, file2Url);
