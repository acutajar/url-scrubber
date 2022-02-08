<script>
  import * as Papa from "papaparse";
  import { badWords, badTLDs } from "./removed-words.js";
  async function scrub() {
    const uploadedFile = document.getElementById("file-input").files[0];
    Papa.parse(uploadedFile, {
      header: true,
      complete: function (results) {
        parseResults(results.data);
      },
    });
  }

  const parseResults = (results) => {
    let linkingFrom = results.map((item) => item["Linking From"].split("\r\n"));
    linkingFrom = [].concat.apply([], linkingFrom);

    let linkingTo = results.map((item) => item["Linking To"].split("\r\n"));
    linkingTo = [].concat.apply([], linkingTo);
    const linksArr = linkingFrom.map((val, i) => [linkingTo[i], val]);
    scrubLinks(linksArr);
  };

  let badTLDsObj = {};
  badTLDs.forEach((tld) => (badTLDsObj[tld] = ""));

  const scrubLinks = (arr) => {
    let cleanLinks = [];
    arr.forEach((element) => {
      if (!checkDomain(element[1]) || !checkTLD(element[1]))
        cleanLinks.push(element);
    });
    console.log("clean", cleanLinks);
  };

  function checkDomain(url) {
    for (let i = 0; i < badWords.length; i++) {
      if (url.includes(badWords[i])) {
        // console.log(url, badWords[i]);
        return false;
      }
    }
    return true;
  }

  function checkTLD(url) {
    url = new URL(url);
    let tld = "." + url.hostname.split(".").pop();
    return !(tld in badTLDsObj);
  }
</script>

<main>
  <h1>Hello!</h1>

  <input type="file" id="file-input" />
  <button on:click={scrub}>Scrub</button>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
