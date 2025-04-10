import nextPwa from 'next-pwa';

const withPWA = nextPwa({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

const config = {
  reactStrictMode: true,
};

export default withPWA(config);
