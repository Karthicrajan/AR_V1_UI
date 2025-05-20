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

const { Header, Sider, Content } = Layout;
const { Dragger } = Upload;
const { TextArea } = Input;

const processingSteps = [
  { 
    title: 'OCR',
    icon: <Progress type="circle" percent={0} size={48} strokeColor="#108ee9" />
  },
  { 
    title: 'Report Segregation',
    icon: <Progress type="circle" percent={0} size={48} strokeColor="#108ee9" />
  },
  { 
    title: 'AI Analysis',
    icon: <Progress type="circle" percent={0} size={48} strokeColor="#108ee9" />
  },
  { 
    title: 'Rule Implementation',
    icon: <Progress type="circle" percent={0} size={48} strokeColor="#108ee9" />
  },
  { 
    title: 'Data Extraction',
    icon: <Progress type="circle" percent={0} size={48} strokeColor="#108ee9" />
  }
];

// API Types
interface ProcessingStatus {
  [fileId: string]: {
    ocr: boolean;
    reportSegrigation: boolean;
    AiAnalysis: boolean;
    RuleImplementation: boolean;
    dataExraction: boolean;
  }
}

interface StepProgress {
  fileId: string;
  totalPage: number;
  completedPage: number;
  remainingPage: number;
  ocrProgress: number;
  reportProgress: number;
  aiProgress: number;
  ruleProgress: number;
  dataProgress: number;
}

// API Service
const apiService = {
  // Replace this URL with your actual API endpoint
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',

  async getProgress(fileId: string): Promise<StepProgress> {
    try {
      const response = await fetch(`${this.baseUrl}/progress/${fileId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching progress:', error);
      throw error;
    }
  },

  // Mock data for development
  getMockProgress(currentProgress: StepProgress): StepProgress {
    return {
      ...currentProgress,
      ocrProgress: currentProgress.ocrProgress < 100 ? 
        Math.min(100, currentProgress.ocrProgress + 10) : 100,
      reportProgress: currentProgress.ocrProgress === 100 ? 
        Math.min(100, currentProgress.reportProgress + 10) : currentProgress.reportProgress,
      aiProgress: currentProgress.reportProgress === 100 ? 
        Math.min(100, currentProgress.aiProgress + 10) : currentProgress.aiProgress,
      ruleProgress: currentProgress.aiProgress === 100 ? 
        Math.min(100, currentProgress.ruleProgress + 10) : currentProgress.ruleProgress,
      dataProgress: currentProgress.ruleProgress === 100 ? 
        Math.min(100, currentProgress.dataProgress + 10) : currentProgress.dataProgress
    };
  }
};

// Dummy API simulation
const dummyApi = {
  getProgress: (fileId: string, currentProgress: StepProgress): StepProgress => {
    // Return completed progress immediately
    return {
      ...currentProgress,
      ocrProgress: 100,
      reportProgress: 100,
      aiProgress: 100,
      ruleProgress: 100,
      dataProgress: 100,
      completedPage: 10,
      remainingPage: 0
    };
  }
};

export default function Home() {
  const router = useRouter();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(-1);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({});
  const [stepProgress, setStepProgress] = useState<{ [key: string]: StepProgress }>({});

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleUpload = async () => {
    if (fileList.length === 0) {
      antMessage.warning('Please select files to upload');
      return;
    }

    // Process each file one at a time
    for (let fileIndex = 0; fileIndex < fileList.length; fileIndex++) {
      const currentFile = fileList[fileIndex];
      setCurrentFileIndex(fileIndex);
      
      // Initialize current file's progress
      setStepProgress(prev => ({
        ...prev,
        [currentFile.uid]: {
          fileId: currentFile.uid,
          totalPage: 10,
          completedPage: 0,
          remainingPage: 10,
          ocrProgress: 0,
          reportProgress: 0,
          aiProgress: 0,
          ruleProgress: 0,
          dataProgress: 0
        }
      }));

      // Initialize current file's status
      setProcessingStatus(prev => ({
        ...prev,
        [currentFile.uid]: {
          ocr: false,
          reportSegrigation: false,
          AiAnalysis: false,
          RuleImplementation: false,
          dataExraction: false
        }
      }));

      // Process each step in sequence
      // Step 1: OCR
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setStepProgress(prev => ({
            ...prev,
            [currentFile.uid]: {
              ...prev[currentFile.uid],
              ocrProgress: 100,
              completedPage: 2,
              remainingPage: 8
            }
          }));
          setProcessingStatus(prev => ({
            ...prev,
            [currentFile.uid]: { ...prev[currentFile.uid], ocr: true }
          }));
          resolve();
        }, 5000);
      });

      // Step 2: Report Segregation
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setStepProgress(prev => ({
            ...prev,
            [currentFile.uid]: {
              ...prev[currentFile.uid],
              reportProgress: 100,
              completedPage: 4,
              remainingPage: 6
            }
          }));
          setProcessingStatus(prev => ({
            ...prev,
            [currentFile.uid]: { ...prev[currentFile.uid], reportSegrigation: true }
          }));
          resolve();
        }, 5000);
      });

      // Step 3: AI Analysis
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setStepProgress(prev => ({
            ...prev,
            [currentFile.uid]: {
              ...prev[currentFile.uid],
              aiProgress: 100,
              completedPage: 6,
              remainingPage: 4
            }
          }));
          setProcessingStatus(prev => ({
            ...prev,
            [currentFile.uid]: { ...prev[currentFile.uid], AiAnalysis: true }
          }));
          resolve();
        }, 5000);
      });

      // Step 4: Rule Implementation
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setStepProgress(prev => ({
            ...prev,
            [currentFile.uid]: {
              ...prev[currentFile.uid],
              ruleProgress: 100,
              completedPage: 8,
              remainingPage: 2
            }
          }));
          setProcessingStatus(prev => ({
            ...prev,
            [currentFile.uid]: { ...prev[currentFile.uid], RuleImplementation: true }
          }));
          resolve();
        }, 5000);
      });

      // Step 5: Data Extraction
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setStepProgress(prev => ({
            ...prev,
            [currentFile.uid]: {
              ...prev[currentFile.uid],
              dataProgress: 100,
              completedPage: 10,
              remainingPage: 0
            }
          }));
          setProcessingStatus(prev => ({
            ...prev,
            [currentFile.uid]: { ...prev[currentFile.uid], dataExraction: true }
          }));
          resolve();
        }, 5000);
      });

      // Wait before processing next file
      if (fileIndex < fileList.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  };

  const handleRemove = (file: UploadFile) => {
    setFileList(prev => prev.filter(f => f.uid !== file.uid));
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      setChatMessages(prev => [...prev, { text: message, isUser: true }]);
      setMessage('');
      // Simulate AI response
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          text: "I'm your AI assistant. How can I help you with your files?", 
          isUser: false 
        }]);
      }, 1000);
    }
  };

  const getCurrentStep = (status: ProcessingStatus, fileId: string): number => {
    const fileStatus = status[fileId];
    if (!fileStatus) return 0;
    
    if (fileStatus.dataExraction) return 5;
    if (fileStatus.RuleImplementation) return 4;
    if (fileStatus.AiAnalysis) return 3;
    if (fileStatus.reportSegrigation) return 2;
    if (fileStatus.ocr) return 1;
    return 0;
  };

  const getStepProgress = (stepIndex: number): number => {
    if (currentFileIndex < 0) return 0;
    const currentFile = fileList[currentFileIndex];
    if (!currentFile) return 0;
    
    const progress = stepProgress[currentFile.uid];
    if (!progress) return 0;

    // Return the actual progress for each step
    switch (stepIndex) {
      case 0: return progress.ocrProgress;
      case 1: return progress.reportProgress;
      case 2: return progress.aiProgress;
      case 3: return progress.ruleProgress;
      case 4: return progress.dataProgress;
      default: return 0;
    }
  };

  const areAllFilesProcessed = () => {
    return fileList.every(file => {
      const fileStatus = processingStatus[file.uid];
      return fileStatus && fileStatus.dataExraction;
    });
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
            height: 'calc(100vh - 64px)', // Subtract header height
            overflow: 'auto'
          }}
        >
          <div className="mx-auto">
            <h1 className="text-2xl font-bold text-neutral-800 mb-6">File Upload</h1>
            
            <Card className="hover:shadow-lg transition-shadow">
              <Dragger
                multiple
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
                  Support for multiple files upload. Strictly prohibited from uploading company data or other
                  banned files.
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

            {/* Processing Steps */}
            {currentFileIndex >= 0 && (
              <div className="mt-12 mb-12">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-lg font-medium">Processing Status</h2>
                  {areAllFilesProcessed() && (
                    <Button
                      type="primary"
                      size="large"
                      onClick={handleViewReport}
                      className="bg-primary-500 hover:bg-primary-600"
                    >
                      View Report
                    </Button>
                  )}
                </div>
                <div className="space-y-12">
                  {fileList.map((file, index) => (
                    <div 
                      key={file.uid} 
                      className={`bg-white p-6 rounded-lg shadow ${
                        index === currentFileIndex ? 'border-2 border-primary-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <FileOutlined className="text-xl text-primary-500" />
                          <span className="font-medium">{file.name}</span>
                        </div>
                        {index === currentFileIndex && (
                          <div className="ml-8">
                            <Progress
                              type="circle"
                              percent={getStepProgress(getCurrentStep(processingStatus, file.uid) - 1)}
                              size={48}
                              strokeColor={{
                                '0%': '#108ee9',
                                '100%': '#87d068',
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <Steps
                        current={getCurrentStep(processingStatus, file.uid)}
                        items={processingSteps.map((step, idx) => ({
                          ...step,
                          icon: (
                            <Progress
                              type="circle"
                              percent={index === currentFileIndex ? getStepProgress(idx) : 
                                (processingStatus[file.uid] && 
                                  ((idx === 0 && processingStatus[file.uid].ocr) ||
                                   (idx === 1 && processingStatus[file.uid].reportSegrigation) ||
                                   (idx === 2 && processingStatus[file.uid].AiAnalysis) ||
                                   (idx === 3 && processingStatus[file.uid].RuleImplementation) ||
                                   (idx === 4 && processingStatus[file.uid].dataExraction)) ? 100 : 0)}
                              size={48}
                              strokeColor="#108ee9"
                            />
                          )
                        }))}
                        size="default"
                        className="px-4 w-full"
                        style={{ 
                          '--ant-steps-item-spacing': '100px',
                          '--ant-steps-item-icon-size': '48px',
                          '--ant-steps-item-title-line-height': '48px',
                          '--ant-steps-item-title-margin-top': '24px',
                          '--ant-steps-item-description-margin-top': '12px',
                          '--ant-steps-item-title-font-size': '16px',
                          '--ant-steps-item-title-font-weight': '500',
                          '--ant-steps-item-title-width': '120px',
                          '--ant-steps-item-content-max-width': '200px'
                        } as React.CSSProperties}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Content>
      </Layout>

      {/* Chat Button */}
      <Button
        type="primary"
        shape="circle"
        size="large"
        icon={<MessageOutlined />}
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-0 right-0 bg-primary-500 hover:bg-primary-600 shadow-lg"
        style={{ margin: 0, borderRadius: '0' }}
      />

      {/* Chat Box */}
      {isChatOpen && (
        <div className="fixed bottom-0 right-0 w-96 bg-white rounded-t-lg shadow-xl border border-neutral-200">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-medium">AI Assistant</h3>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setIsChatOpen(false)}
            />
          </div>
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.isUser
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-100 text-neutral-800'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <TextArea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                autoSize={{ minRows: 1, maxRows: 3 }}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                className="bg-primary-500 hover:bg-primary-600"
              />
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
} 