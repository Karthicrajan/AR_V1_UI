'use client';

import React, { useState } from 'react';
import SortableFilter from '../../component/SortableFilter'
import {
  Layout,
  Button,
  theme,
  Card,
  Upload,
  List,
  message,
} from 'antd';
import {
  InboxOutlined,
  FileOutlined,
  DeleteOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { useMutation } from '@tanstack/react-query';
import { uploadFile } from '@/api-services/uploadFileService';
import * as XLSX from 'xlsx';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { Flex, Spin } from 'antd';

const { Header, Sider, Content } = Layout;
const { Dragger } = Upload;

ModuleRegistry.registerModules([AllCommunityModule]);

export default function Home() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [spreadsheetData, setSpreadsheetData] = useState<any[][]>([]);
  const [columnDefs, setColumnDefs] = useState<any[]>([]);
  const [rowData, setRowData] = useState<any[]>([]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const apiCall = useMutation({
    mutationKey: ['upload-file'],
    mutationFn: async (selectFilter: any) => {
      const formData = new FormData();
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('file', fileList[0].originFileObj as File);
      }
      if (selectFilter && typeof selectFilter === 'object') {
        Object.entries(selectFilter).forEach(([key, value]) => {
          formData.append(key, value != null ? String(value) : '');
        });
      }
      try {
        const result = await uploadFile(formData);

        const workbook = XLSX.read(result.data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (jsonData.length === 0) return;

        const headers = jsonData[0] as string[];
        const dataRows = jsonData.slice(1) as any[][];
        const agColumnDefs = headers.map((header: string) => ({
          headerName: header || '',
          field: header || '',
          sortable: true,
          resizable: true,
        }));
        const agRowData = dataRows.map((rowArr: any[]) => {
          const rowObj: any = {};
          headers.forEach((header: string, idx: number) => {
            rowObj[header] = rowArr[idx] ?? '';
          });
          return rowObj;
        });

        setColumnDefs(agColumnDefs);
        setRowData(agRowData);
        setSpreadsheetData(jsonData as any[][]);

        setFileList([]);

        return result;
      } catch (e: any) {
        console.error('File upload failed:', e);
        throw e;
      }
    },
  });

  const handleRemove = (file: any) => {
    setFileList((prev: any) => prev.filter((f: any) => f?.uid !== file?.uid));
  };

  const handleApply = (selectFilter: any) => {
    apiCall.mutate(selectFilter);
  };

  const handleDownloadExcel = () => {
    if (!spreadsheetData || spreadsheetData.length === 0) {
      message.warning('No data to export');
      return;
    }
    const ws = XLSX.utils.aoa_to_sheet(spreadsheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'spreadsheet-export.xlsx');
  };

  return (
    <Layout className="h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed} className="bg-white">
        <div className="h-16 flex items-center justify-center">
          <h1 className={`text-xl font-bold text-primary-600 ${collapsed ? 'hidden' : 'block'}`}>
            File Upload
          </h1>
        </div>
      </Sider>
      <Layout>
        <Header className="bg-white p-0 flex items-center px-4">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg"
          />
        </Header>
        <Content
          className="p-6"
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            height: 'calc(100vh - 64px)',
            overflow: 'auto',
          }}
        >
          <div className="mx-auto">
            <h1 className="text-2xl font-bold text-neutral-800 mb-6">File Upload</h1>

            <Card className="hover:shadow-lg transition-shadow col-span-8">
              <Dragger
                multiple={false}
                accept=".xls,.xlsx,.csv"
                fileList={fileList}
                onChange={({ fileList }) => setFileList([fileList[fileList.length - 1]])}
                beforeUpload={() => false}
                className="mb-4"
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined className="text-4xl text-primary-500" />
                </p>
                <p className="ant-upload-text text-lg font-medium">
                  Click or drag files to this area to upload
                </p>
              </Dragger>

              <div className="mt-6">
                <h2 className="text-lg font-medium mb-4">Uploaded Files</h2>
                {fileList.length > 0 ? (
                  <List
                    dataSource={fileList}
                    renderItem={(file: any) => (
                      <List.Item
                        className="bg-neutral-50 rounded-lg p-4 mb-2"
                        actions={[
                          <Button
                            key="delete"
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleRemove(file)}
                          />,
                        ]}
                      >
                        <div className="flex items-center gap-4">
                          <FileOutlined className="text-2xl text-primary-500" />
                          <div>
                            <div className="font-medium">{file?.name}</div>
                            <div className="text-sm text-neutral-500">
                              {file?.size ? (file.size / 1024 / 1024).toFixed(2) + " MB" : "Unknown size"}
                            </div>
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />) :
                  <div className="bg-neutral-50 rounded-lg p-4 mb-2 h-[70px] flex items-center text-neutral-400">
                    No files selected
                  </div>
                }
              </div>

              <div className='mt-4'>
                <SortableFilter onApply={handleApply} brnLoading={apiCall.isPending} isDisabled={fileList.length ? false : true} />
              </div>
            </Card>

            {apiCall.isPending ? (
              <div className='flex justify-center mt-4 mx-auto'>
                <Flex align="center" gap="middle">
                  <Spin percent={"auto"} size="large" />
                </Flex>
              </div>
            ) : (spreadsheetData.length > 0 && (
              <Card className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Excel Data Preview</h2>
                  <Button icon={<DownloadOutlined />} onClick={handleDownloadExcel}>
                    Download Excel
                  </Button>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: 700,
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    overflow: 'hidden',
                    background: '#fff',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    padding: 0,
                  }}
                >
                  <div
                    className="ag-theme-alpine"
                    style={{ width: '100%', height: '100%' }}
                  >
                    <AgGridReact
                      rowData={rowData}
                      columnDefs={columnDefs.map(col => ({ ...col, filter: undefined }))}
                      defaultColDef={{
                        sortable: true,
                        resizable: true,
                      }}
                      pagination={false}
                      paginationPageSize={100}
                    />
                  </div>
                </div>
              </Card>
            ))
            }
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
