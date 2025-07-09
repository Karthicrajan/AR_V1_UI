import API from '@/lib/axiosInstance';


export const uploadFile = async (payload: any) => {
    const data = await API.post(
  'http://3.232.107.80:8000/upload/',
  payload,
  {
    responseType: 'arraybuffer',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }
);
    return data;
}