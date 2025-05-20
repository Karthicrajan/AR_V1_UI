import React, { useRef, useEffect } from 'react';
import { SpreadSheets } from '@mescius/spread-sheets-react';
import * as GC from '@mescius/spread-sheets';
import '@mescius/spread-sheets/styles/gc.spread.sheets.excel2013white.css';
import '@mescius/spread-sheets-io';
import saveAs from 'file-saver';

const ExcelViewer = () => {
  const spreadRef = useRef<any>(null);

  useEffect(() => {
    // Load the Excel file when component mounts
    const loadExcelFile = async () => {
      try {
        // Read the Excel file from the public directory
        const response = await fetch('/excel-files/data.xlsx');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        
        if (spreadRef.current) {
          const fileType = GC.Spread.Sheets.FileType.excel;
          spreadRef.current.import(blob, () => {
            console.log('File imported successfully');
          }, (error: any) => {
            console.error('Import failed:', error);
          }, { fileType });
        }
      } catch (error) {
        console.error('Error loading file:', error);
      }
    };

    loadExcelFile();
  }, []);

  const handleWorkbookInit = (spread: any) => {
    spreadRef.current = spread;
  };

  const handleExport = () => {
    if (!spreadRef.current) return;

    const fileName = 'export.xlsx';
    const fileType = GC.Spread.Sheets.FileType.excel;

    spreadRef.current.export(function (blob: any) {
      saveAs(blob, fileName);
    }, function (error: any) {
      console.error('Export failed:', error);
    }, { fileType });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Excel Viewer</h1>
        <button 
          onClick={handleExport} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Export to Excel
        </button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <SpreadSheets
          hostStyle={{ width: '100%', height: 'calc(100vh - 200px)' }}
          workbookInitialized={handleWorkbookInit}
        />
      </div>
    </div>
  );
};

export default ExcelViewer; 