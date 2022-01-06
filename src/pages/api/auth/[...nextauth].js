import NextAuth from "next-auth";

import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      
      authorizationUrl:
        'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
    }),
  ],
  jwt: {
    encryption: true,
  },
  secret: process.env.SECRET,
  // callbacks: {
  //   async jwt(token, account) {
  //     if (account?.accessToken) {
  //       console.log("token",token)
  //       token.accessToken = account.accessToken;
  //     }
      
  //     return token;
  //   },
  //   redirect: async (url, _baseUrl) => {
  //     if (url === '/profile') {
  //       return Promise.resolve('/');
  //     }
  //     return Promise.resolve('/');
  //   },
  // },
});