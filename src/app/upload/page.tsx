'use client';

import React, { useState } from 'react';
import SortableFilter from '../../component/SortableFilter'
import {
  Layout,
  Button,
  theme,
  Card,
  message as antMessage,
  Table,
  Upload,
  List,
} from 'antd';
import {
  InboxOutlined,
  FileOutlined,
  DeleteOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { useMutation } from '@tanstack/react-query';
import { uploadFile } from '@/api-services/uploadFileService';
import * as XLSX from 'xlsx';


const { Header, Sider, Content } = Layout;
const { Dragger } = Upload;

export default function Home() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [tableData, setTableData] = useState<any>([]);
  const [tableColumns, setTableColumns] = useState<any>([]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const apiCall = useMutation({
    mutationKey: ['upload-file'],
    mutationFn: async () => {
      const formData = new FormData();
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('file', fileList[0].originFileObj as File);
      }
      try {
        const result = await uploadFile(formData);

        const workbook = XLSX.read(result.data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (jsonData.length === 0) return;

        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1);

        const columns = headers?.map((header: string, index: number) => ({
          title: header || `Column ${index + 1}`,
          dataIndex: `col_${index}`,
          key: `col_${index}`,
          width: 150,
          ellipsis: true,
        }));

        const data = rows.map((row: any, rowIndex: number) => {
          const rowData: any = { key: rowIndex };
          row.forEach((cell: any, colIndex: any) => {
            rowData[`col_${colIndex}`] = cell;
          });
          return rowData;
        });

        setTableColumns(columns);
        setTableData(data);
        setFileList([]);

        return result;
      } catch (e: any) {
        console.error('File upload failed:', e);
        throw e;
      }
    },
  });

  const handleUpload = () => {
    if (fileList.length === 0) {
      antMessage.warning('Please select files to upload');
      return;
    }
    apiCall.mutate();
  };

  const handleRemove = (file: any) => {
    setFileList((prev: any) => prev.filter((f: any) => f?.uid !== file?.uid));
  };

  const handleApply = (selectedFilters: any) => {
    console.log('Selected & Sorted Filters:', selectedFilters);
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

            <div className='grid grid-cols-12 gap-10'>
                <Card className="hover:shadow-lg transition-shadow col-span-8">
                  <Dragger
                    multiple
                    accept=".xls,.xlsx"
                    fileList={fileList}
                    onChange={({ fileList }) => setFileList(fileList)}
                    beforeUpload={() => false}
                    className="mb-4"
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined className="text-4xl text-primary-500" />
                    </p>
                    <p className="ant-upload-text text-lg font-medium">
                      Click or drag files to this area to upload
                    </p>
                    <p className="ant-upload-hint text-neutral-500">
                      Support for multiple files upload.
                    </p>
                  </Dragger>


                  {fileList.length > 0 && (
                    <div className="mt-6">
                      <h2 className="text-lg font-medium mb-4">Uploaded Files</h2>
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
                      />
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    <Button
                      type="primary"
                      size="large"
                      onClick={handleUpload}
                      loading={apiCall.isPending}
                      disabled={fileList.length === 0}
                      className="bg-primary-500 hover:bg-primary-600"
                    >
                      Upload Files
                    </Button>
                  </div>
                </Card>
              <div className='col-span-4'>
                <SortableFilter onApply={handleApply} />
              </div>

            </div>


            {tableData.length > 0 && (
              <Card className="mt-8">
                <div className='flex justify-between my-2 mx-2'>
                  <div>
                    <h1 className='font-bold'>Excel View</h1>
                  </div>
                  <div>
                    <Button
                      type="primary"
                      onClick={() => {
                        const headers = tableColumns.map((col: any) => col.title);
                        const rows = tableData.map((row: any) =>
                          tableColumns.map((col: any) => row[col.dataIndex] || '')
                        );
                        const fullData = [headers, ...rows];

                        const worksheet = XLSX.utils.aoa_to_sheet(fullData);
                        const workbook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
                        XLSX.writeFile(workbook, 'uploaded-data.xlsx');
                      }}
                    >
                      Download Excel
                    </Button>
                  </div>
                </div>

                <Table
                  columns={tableColumns}
                  dataSource={tableData}
                  bordered
                  scroll={{ x: 'max-content' }}
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            )}
          </div>
        </Content>
      </Layout>

    </Layout>
  );
}