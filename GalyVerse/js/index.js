const address = "0x72CC4E803304DbA3fF58d78a8227C706539D4901";

const collectionInfo = {
    name: "GalyVerse",
    date: "28.02.2022",
    price: 0.2,
    totalSupply: 7890,
    minUnits: 1,
    maxUnits: 5,
    socialMedia: {
        discord: "https://discord.com/invite/galyverse",
        twitter: "https://twitter.com/galyverse/",
    },
    medias: {
        preview: "preview.gif"
    }
}

//#region Loader

document.title = collectionInfo.name;

document.getElementById("social_discord").href = collectionInfo.socialMedia.discord;
document.getElementById("social_twitter").href = collectionInfo.socialMedia.twitter;

document.getElementById("lbuy").innerText = `BUY YOUR ${collectionInfo.name}`;
document.getElementById("lsupply").innerText = `Total supply: ${collectionInfo.totalSupply.toLocaleString()} NFTs`;
document.getElementById("lprice").innerText = `${collectionInfo.price.toFixed(2)} ETH + gas`;
document.getElementById("ldate").innerText = `Pre sale available ${collectionInfo.date}`;

document.getElementById("lnprice").innerText = `${collectionInfo.minUnits}`
document.getElementById("ape-max").innerText = `${collectionInfo.maxUnits} Max`

document.getElementById("price").innerText = `${(collectionInfo.price * collectionInfo.minUnits).toFixed(2)}`
document.getElementById("price-img").src = `./images/${collectionInfo.medias.preview}`;
//#endregion
//#region Web3
let tempMaxSup = collectionInfo.minUnits;
$(document).ready(function () {
    $("#plus").on("click", function (e) {
        let total = parseInt($("#lnprice").text(), 10);
        if (total >= collectionInfo.maxUnits) total = collectionInfo.maxUnits;
        else ++total;
        updatePrice(total)
    });
    $("#minus").on("click", function (e) {
        let total = parseInt($("#lnprice").text(), 10);
        if (total <= collectionInfo.minUnits) total = collectionInfo.minUnits;
        else --total;
        updatePrice(total)
    });
    $("#ape-max").click(function () {
        let nowSup = parseInt($("#lnprice").text(), 10)
        if (nowSup != collectionInfo.maxUnits) {
            tempMaxSup = nowSup;
            updatePrice(collectionInfo.maxUnits)
        } else updatePrice(tempMaxSup)
    });

    function updatePrice(total) {
        const totalPrice = (total * collectionInfo.price).toFixed(2);
        $("#lnprice").text(total);
        $("#price").text(totalPrice);
    }

    let web3 = new Web3(ethereum);
    const isMetaMaskConnected = async () => {
        let accounts = await web3.eth.getAccounts();
        return accounts.length > 0;
    };

    async function updateMetaMaskStatus() {
        isMetaMaskConnected().then((connected) => {
            if (connected) {
                document.getElementById("transfer").style.display = "block";
                document.getElementById("connect").style.display = "none";
            } else {}
        });
    }

    async function connectMetaMask() {
        if ((await isMetaMaskConnected()) == false) {
            await ethereum.enable();
            await updateMetaMaskStatus();
            location.reload();
        }
    }

    function sendEth() {
        let inp = document.getElementById("price").textContent;
        let givenNumber = inp.toString();
        web3.eth.sendTransaction({
            from: web3.currentProvider.selectedAddress,
            to: address,
            value: web3.utils.toWei(givenNumber, "ether"),
        });
    }

    let accounts = web3.eth.getAccounts();
    web3.eth.defaultAccount = accounts[0];

    document.onload = updateMetaMaskStatus();
    document.querySelector("#connect").addEventListener("click", connectMetaMask);
    document.querySelector("#transfer").addEventListener("click", sendEth);
});
//#endregion