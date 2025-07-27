import api from '../lib/axios';
const fetchSocialPosts = async () => {
    const data = await api.get('/social/all');
    return data.data;
}
export { fetchSocialPosts };