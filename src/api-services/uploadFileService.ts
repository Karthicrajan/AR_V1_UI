import API from '@/lib/axiosInstance';


export const uploadFile = async (payload: any) => {
    const data = await API.post(
  'http://44.207.8.63:8080/upload/',
  payload,
  {
    responseType: 'arraybuffer', // 👈 tells Axios to return raw binary
    headers: {
      'Content-Type': 'multipart/form-data', // if you're uploading a file
    },
  }
);
    return data;
}