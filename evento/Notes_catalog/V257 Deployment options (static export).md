## V257 Deployment Options (Static Export)
Description: Learn about the different deployment options for Next.js.

Now we need to deploy the project.

One thing we could do is to do so called static export, we can go to `next.config.js` file, we can add there `output: "export",` When we do this, and now we can run build command, script `$ next build`

`next.config.js` before altering
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bytegrad.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

module.exports = nextConfig;
```


`next.config.js` after altering with  `output: "export",`
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bytegrad.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

module.exports = nextConfig;
```

Running a build meaning it is going to optimize everything, minify the files, remove as many things as possible, that we are not using, also do some extra checking, we could make an extra typo somewhere or other mistakes, it can warn us during the build. It can stop the build so we do not ship that to production. 

We can run the build, and now the way we have done it with  `output: "export",` is we will actually get a bunch of HTML, CSS and JavaScript files, that we can put anywhere we want, just some static files. We should be able to put them everywhere, it will work almost the same. Unfortunately when we do it that way we lose the benefit of server-side features that we have. We are going to have static files, so we are not going to have a server running in the background. There will be no server components or Server Actions, it will lack many of these features.

If we want to get a bunch of HTML, CSS, JavaScript files, that we can put anywhere we want, maybe a static export is what we need.