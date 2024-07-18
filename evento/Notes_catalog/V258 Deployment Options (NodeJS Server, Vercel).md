## V258 Deployment Options (NodeJS Server, Vercel)
Description: Learn why you would want to deploy to a Node.js server.


Now we do not want a static export, we want to keep using server components or Server Actions and many other features of Next.js. We will need some server running in the background also with dynamic rendering, that will server requests. We will need to deploy it somewhere that can spin up our Next.js app on some Node.js server.

We are going to deploy it on Vercel, and Vercel will run `next build` (`package.json`) on their servers, Vercel has optimized the whole process, Vercel will start build on their servers, and will make sure that when we have requests going to the server that there is a server that can respond to that.

We can already preview how that build is going to look like
We can run locally `$ npm run build`
We can see some information about the build, if there are any problems we can already fix them before we actually deploy.
We can see some information, during the build some of the routes are going to be pre-rendered, meaning their HTML is going to be generated during the build, Vercel will do that for us. On some (`λ` dynamic) routes it will be not be able to do that. 

We will do that build on Vercel servers, sometimes it is good to do this locally as well.