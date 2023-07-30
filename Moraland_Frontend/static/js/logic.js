import { contractAddress } from "./constants.js";
import { abi } from "./constants.js";
import { ethers } from "./ethers-5.1.umd.min.js";
// Map management constants
const tiles = 12; //in pixels
const plots = tiles * 9; //in pixels
const roads = tiles * 2; //in pixels
const initialOffsets = plots + roads;
const plotViewOffsets = plots + 2 * roads;
//- Canvas and context
const mainCanvas = document.getElementById("mainCanvas");
const mainCtx = mainCanvas.getContext("2d");
const worldImage = new Image();
const plotCanvas = document.getElementById("plotCanvas");
const plotCtx = plotCanvas.getContext("2d");
//- State
const mapView = {
  mapOfFsetX: -1 * initialOffsets,
  mapOfFsetY: -1 * initialOffsets,
};

const plotView = { plotId: "", plotX: 0, plotY: 0, locationX: 0, locationY: 0 };
const unassignables = [
  "pX0pY2lX288lY552",
  "pX1pY2lX420lY552",
  "pX2pY2lX552lY552",
  "pX3pY2lX684lY552",
  "pX0pY3lX288lY684",
  "pX1pY3lX420lY684",
  "pX2pY3lX552lY684",
  "pX3pY3lX684lY684",
  "pX0pY4lX288lY816",
  "pX1pY4lX420lY816",
  "pX0pY5lX288lY948",
  "pX1pY5lX420lY948",
  "",
];

// // web3 constants

// const ethers = Moralis.web3Library;
const claimButton = document.getElementById("claimButton");
claimButton.onclick = claim;
// wallet connection
const connectButton = document.getElementById("connectButton");
connectButton.onclick = connect;

async function claim() {
  if (typeof window.ethereum !== "undefined") {
    if (connectButton.innerHTML === "Connected!") {
      console.log("claim process started...");
      const tokenURI =
        "https://ipfs.io/ipfs/QmT8Mgj5LgM3u7NhUNYBwKr6M7QoinNZH5r9Ufj8tJmpCM?filename=Moraland.png";
      const tokenId = document.getElementById("plotID").value;
      console.log(tokenId);
      const bytesId = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(tokenId));
      console.log(bytesId);
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const options = {
          gasLimit: 300000,
        };

        const transactionResponse = await contract.assign(
          tokenURI,
          bytesId,
          options
        );
        const transactionReceipt = await transactionResponse.wait();
        alert("Transaction Completed!")
        console.log("Transaction hash:", transactionReceipt.transactionHash);
        console.log("Gas used:", transactionReceipt.gasUsed.toString());
        console.log("Status:", transactionReceipt.status);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Connect Your Wallet!");
    }
  }
}


async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error);
    }
    connectButton.innerHTML = "Connected!";
    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log(accounts);
  } else {
    connectButton.getElementById("connectButton").innerHTML =
      "Please Install Metamask!";
  }

}


//- Canvas drwaing function
function drawCanvas() {
  mainCanvas.width = 3 * plots + 4 * roads;
  mainCanvas.height = 3 * plots + 4 * roads;
  plotCanvas.width = plots;
  plotCanvas.height = plots;
  worldImage.src = "static/img/Moraland.png";
  worldImage.onload = () => {
    initializeMap();
    mainCtx.drawImage(worldImage, -1 * (plots + roads), -1 * (plots + roads));
    mainCtx.strokeRect(plots + 2 * roads, plots + 2 * roads, plots, plots);
  };
}


function initializeMap() {
  updateplotlocation();
  drawMapSection(mainCtx, mapView.mapOfFsetX, mapView.mapOfFsetY);
  drawCursor(plotViewOffsets, plotViewOffsets)
  drawMapSection(plotCtx, -1 * plotView.locationX, -1 * plotView.locationY);
  //setPlotData();
}


function move(direction) {
  const validMove = validateMove(direction);
  if (validMove) {
    updateView(direction);
    updateplotlocation();
    drawMapSection(mainCtx, mapView.mapOfFsetX, mapView.mapOfFsetY);
    drawCursor(plotViewOffsets, plotViewOffsets);
    drawMapSection(plotCtx, -1 * plotView.locationX, -1 * plotView.locationY);
    setPlotData();
  }
}


function validateMove(direction) {
  switch (direction) {
    case "ArrowRight":
      return !(plotView.plotX == 5);
    case "ArrowUp":
      return !(plotView.plotY == 0);
    case "ArrowLeft":
      return !(plotView.plotX == 0);
    case "ArrowDown":
      return !(plotView.plotY == 5);
  }
}


function updateView(direction) {
  switch (direction) {
    case "ArrowRight":
      plotView.plotX += 1;
      mapView.mapOfFsetX -= plots + roads;
      // updateplotlocation()
      break;

    case "ArrowDown":
      plotView.plotY += 1;
      mapView.mapOfFsetY -= plots + roads;
      // updateplotlocation()
      break;

    case "ArrowLeft":
      plotView.plotX -= 1;
      mapView.mapOfFsetX += plots + roads;
      // updateplotlocation()
      break;

    case "ArrowUp":
      plotView.plotY -= 1;
      mapView.mapOfFsetY += plots + roads;
      // updateplotlocation()
      break;
  }
}


function drawMapSection(ctx, originX, originY) {
  ctx.drawImage(worldImage, originX, originY);
}


function drawCursor(x, y) {
  mainCtx.strokeRect(x, y, plots, plots);
}


function updateplotlocation() {
  plotView.locationX = -1 * mapView.mapOfFsetX + plotViewOffsets;
  plotView.locationY = -1 * mapView.mapOfFsetY + plotViewOffsets;
}

// ui functions
let plotId = ""; // Declare the plotId variable

function setPlotData() {
  // const plotId = ethers.utils.id(JSON.stringify(plotView));
  document.getElementById("plotX").value = plotView.plotX;
  document.getElementById("plotY").value = plotView.plotY;
  document.getElementById("locationX").value = plotView.locationX;
  document.getElementById("locationY").value = plotView.locationY;
  // document.getElementById("plotID").value = plotId;
  plotId =
    "pX" +
    plotView.plotX +
    "pY" +
    plotView.plotY +
    "lX" +
    plotView.locationX +
    "lY" +
    plotView.locationY;
  document.getElementById("plotID").value = plotId;
  isPlotAssignable(plotId);
  // isPlotAssignable(plotID);
}

function isPlotAssignable(plotID) {
  const _unassignable = unassignables.includes(plotID);
  if (_unassignable) {
    document.getElementById("claimButton").setAttribute("disabled", null);
  } else {
    document.getElementById("claimButton").removeAttribute("disabled");
  }
}


drawCanvas();
window.addEventListener("keydown", (e) => {
  move(e.key);
});