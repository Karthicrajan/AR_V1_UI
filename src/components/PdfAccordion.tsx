import React from 'react';
import { Collapse } from 'antd';

const pdfs = [
  { name: 'Final Report 1', path: '/pdfs/CopyrightReceipt.pdf' },
  { name: 'Final Report 1', path: '/pdfs/CopyrightReceipt.pdf' },
  { name: 'Final Report 1', path: '/pdfs/CopyrightReceipt.pdf' },
];

const items = pdfs.map((pdf, idx) => ({
  key: idx.toString(),
  label: pdf.name,
  children: (
    <iframe
      src={pdf.path}
      width="100%"
      height="600px"
      title={pdf.name}
      style={{ border: 'none' }}
    />
  ),
}));

const PdfAccordion = () => (
  <div>
    <h1 className="text-xl font-bold mb-4">PDF Viewer</h1>
    <Collapse accordion items={items} />
  </div>
);

export default PdfAccordion; 