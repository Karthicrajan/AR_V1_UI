'use client';

import React, { useState } from 'react';
import { Layout, Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import animationData from '../../public/lottie/animation.json';
import { useRouter } from 'next/navigation';

const { Content } = Layout;
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
});

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      console.log('Login values:', values);
      if(values.username === 'demo@gmail.com' && values.password === 'Demo@123'){
        router.push('/upload');
      }else{
        message.error('Invalid username or password');
      }
    } catch (error:any) {
      message.error('Login failed. Please try again.', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="min-h-screen">
      <Content className="flex">
        <div className="w-1/2 bg-gray-50 flex items-center justify-center p-8">
          <div className="w-full max-w-lg">
            <Lottie
              animationData={animationData}
              loop={true}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>

        <div className="w-1/2 flex items-center justify-center p-12">
          <div className="max-w-md w-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-gray-600 mb-8">Please login to your account</p>

            <Form
              name="login"
              onFinish={onFinish}
              layout="vertical"
              requiredMark={false}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input 
                  prefix={<UserOutlined className="text-gray-400" />} 
                  placeholder="Username" 
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Password"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Content>
    </Layout>
  );
} 