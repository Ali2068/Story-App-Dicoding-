const BASE_URL = 'https://story-api.dicoding.dev/v1';

const StoryAPI = {
  async getAllStories() {
    const response = await fetch(`${BASE_URL}/stories`);
    const responseJson = await response.json();
    return responseJson.listStory;
  },
};

export default StoryAPI;