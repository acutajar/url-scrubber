<script>
  import * as Papa from "papaparse";
  let uploadedFile = "";
  async function scrub() {
    uploadedFile = document.getElementById("file-input").files[0];
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
  };
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
