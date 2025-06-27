'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Button, theme, Input, Card, message as antMessage, Progress, Steps } from 'antd';
import { Upload, List } from 'antd';
import { 
  InboxOutlined, 
  FileOutlined, 
  DeleteOutlined, 
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  MessageOutlined,
  SendOutlined,
  CloseOutlined
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { uploadFile } from '@/api-services/uploadFileService';



const { Header, Sider, Content } = Layout;
const { Dragger } = Upload;


export default function Home() {
  const router = useRouter();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  const apiCall = useMutation({
  mutationKey: ['upload-file'],
  mutationFn: async () => {
    try {
      const result = await uploadFile();
      return result;
    } catch (e: any) {
      console.error("File upload failed:", e);
      throw e;
    }
  },
});

useEffect(() => {
  apiCall.mutate();
  return () => {
    
  };
}, []);


  const handleUpload = async () => {
    if (fileList.length === 0) {
      antMessage.warning('Please select files to upload');
      return;
    }



  };

  const handleRemove = (file: UploadFile) => {
    setFileList(prev => prev.filter(f => f.uid !== file.uid));
  };


  const handleViewReport = () => {
    router.push('/compare');
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
            overflow: 'auto'
          }}
        >
          <div className="mx-auto">
            <h1 className="text-2xl font-bold text-neutral-800 mb-6">File Upload</h1>
            
            <Card className="hover:shadow-lg transition-shadow">
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
                    renderItem={(file) => (
                      <List.Item
                        className="bg-neutral-50 rounded-lg p-4 mb-2"
                        actions={[
                          <Button
                            key="delete"
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleRemove(file)}
                          />
                        ]}
                      >
                        <div className="flex items-center gap-4">
                          <FileOutlined className="text-2xl text-primary-500" />
                          <div>
                            <div className="font-medium">{file.name}</div>
                            <div className="text-sm text-neutral-500">
                              {(file.size! / 1024 / 1024).toFixed(2)} MB
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
                  disabled={fileList.length === 0}
                  className="bg-primary-500 hover:bg-primary-600"
                >
                  Upload Files
                </Button>
              </div>
            </Card>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
} 