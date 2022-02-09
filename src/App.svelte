<script>
  import * as Papa from "papaparse";
  import * as XLSX from "xlsx";
  import { badWords, badTLDs } from "./removed-words.js";
  import { saveAs } from "file-saver";
  let wbOut = "";
  let removedURLs = [];
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
    let linkingFrom = results.map((item) => {
      if (item["Linking From"] != undefined)
        return item["Linking From"].split("\r\n");
    });
    linkingFrom = [].concat.apply([], linkingFrom);
    let linkingTo = results.map((item) => {
      if (item["Linking To"] != undefined)
        return item["Linking To"].split("\r\n");
    });
    linkingTo = [].concat.apply([], linkingTo);
    const linksArr = linkingFrom
      .map((val, i) => [linkingTo[i], val])
      .filter((item) => item[0] != undefined);
    console.log(linksArr);
    scrubLinks(linksArr);
  };

  let badTLDsObj = {};
  badTLDs.forEach((tld) => (badTLDsObj[tld] = ""));

  const scrubLinks = (arr) => {
    let cleanLinks = [];
    arr.forEach((element) => {
      if (checkDomain(element[1]) && checkTLD(element[1]))
        cleanLinks.push(element);
    });
    createWorkbook(cleanLinks);
  };

  function checkDomain(url) {
    for (let i = 0; i < badWords.length; i++) {
      if (url.includes(badWords[i])) {
        removedURLs.push([url, badWords[i]]);
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

  function createWorkbook(array) {
    const wb = XLSX.utils.book_new();
    const cleanedWs = XLSX.utils.aoa_to_sheet([
      ["Linking to", "URL"],
      ...array,
    ]);
    const removedWs = XLSX.utils.aoa_to_sheet([
      ["Removed URL", "Bad Word Found"],
      ...removedURLs,
    ]);
    XLSX.utils.book_append_sheet(wb, cleanedWs, "Scrubbed URLs");
    XLSX.utils.book_append_sheet(wb, removedWs, "Removed URLs");
    wbOut = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    wbDownload(wbOut);
  }

  function s2ab(s) {
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf); //create uint8array as viewer
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
    return buf;
  }

  function wbDownload(data) {
    let wbTitle = document.getElementById("output-title").value;
    wbTitle = wbTitle + ".xlsx";
    saveAs(
      new Blob([s2ab(data)], { type: "application/octet-stream" }),
      wbTitle
    );
  }

  function handleDragEnter(e) {
    document.getElementById(e.target.id).style.border = "2px solid red";
  }
  function handleDragAndDrop(e) {
    document.getElementById(e.target.id).style.border = "2px solid red";
  }
  function handleDragLeave(e) {
    document.getElementById(e.target.id).style.border = "2px dashed red";
  }
</script>

<main>
  <h1>Hello!</h1>

  <input
    type="file"
    id="file-input"
    on:dragenter={handleDragEnter}
    on:dragleave={handleDragLeave}
    on:drop={handleDragAndDrop}
  />
  <form action="">
    <label for="output-title">Enter title for output file:</label>
    <input type="text" id="output-title" value="Scrubbed_Urls" />
  </form>
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

  #file-input {
    border: 2px dashed red;
    width: 80vw;
    height: 25vh;
    border-radius: 15px;
    padding: 10px;
    margin: 10px;
  }

  @media (min-width: 600px) {
    main {
      max-width: none;
    }
  }
</style>
