const UrlParser = {
  parseActiveUrlWithCombiner() {
    const url = window.location.hash.slice(1).toLowerCase();
    const [path] = url.split('/');
    return `/${path || ''}`;
  },
};

export default UrlParser;
