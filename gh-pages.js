const ghpages = require("gh-pages");

ghpages.publish(
  "public", // path to public directory
  {
    branch: "gh-pages",
    repo: "https://github.com/acutajar/url-scrubber.git", // Update to point to your repository
    user: {
      name: "Alec", // update to use your name
      email: "aleccutajar@gmail.com", // Update to use your email
    },
  },
  () => {
    console.log("Deploy Complete!");
  }
);
