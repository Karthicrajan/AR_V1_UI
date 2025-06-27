import API from '@/lib/axiosInstance';


export const uploadFile = async () => {
    console.log(1,"api")
    const data = await API.get('https://jsonplaceholder.typicode.com/posts');
    return data;
}