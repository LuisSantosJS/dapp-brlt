import { useEffect, useState } from "react";
import "./index.css";
import { Buffer } from "buffer";
import { QrCodePix } from "qrcode-pix";
//@ts-ignore
import QRCode from "qrcode.react";

import {
  getContract,
  getAccountAddress,
  connectWalletHandler,
} from "./services/web3";
function App() {
  window.Buffer = Buffer;

  const [balance, setBalance] = useState<string>("");
  const [address, setAddress] = useState<string | null>(null);
  const [index0, setIndex0] = useState<boolean>(true);
  const [payload, setPayload] = useState<any>(null);
  const getBalance = async (address: string) => {
    const balan = await getContract()?.balanceOf(address);
    setBalance(String(Number(balan.toString()) / 100));
  };

  const mintTo = async () => {
    const a = await getContract()?.mintTo(address, 10000);
    console.log(a);
  };
  useEffect(() => {
    getAccountAddress().then((r) => {
      setAddress(r);
      getBalance(r);
    });
  }, [window]);

  useEffect(() => {
    if (!!address) {
      const qrCodePix = QrCodePix({
        version: "01",
        key: "+5568984198513", //or any PIX key
        name: "Iroxy solucoes digit",
        city: "SAO PAULO",
        message: address,
      });

      setPayload(qrCodePix.payload());
    }
  }, [address]);

  const connectWalletButton = () => {
    return (
      <button
        onClick={connectWalletHandler}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    );
  };

  return (
    <div className="main-app">
      <div className="main-white-box">
        {!!address && (
          <div className="tabsRow">
            <div className="rowTab">
              <span className="taab" onClick={() => setIndex0(true)}>
                Balance
              </span>
              <span className="taab" onClick={() => setIndex0(false)}>
                Deposit
              </span>
            </div>
            <div
              style={{
                height: 1,
                justifyContent: "flex-start",
              }}
              className="rowTab"
            >
              <div
                style={{ marginLeft: index0 ? "0px" : "50%" }}
                className="target"
              />
            </div>
          </div>
        )}
        <div className="main-box">
          {!!address && index0 && <h1>{balance} BRLT </h1>}
          {!address && index0 && <div>{connectWalletButton()}</div>}
          {!!address && !index0 && (
            <h3 style={{ paddingBottom: 20 }}>deposit by PIX</h3>
          )}
          {!!address && !index0 && !!payload && <QRCode value={payload} />}
        </div>

        <div
          style={{
            height: 35,
            alignItems: "center",
            justifyContent: "center",
          }}
          className="rowTab"
        >
          <span>
            View token in{" "}
            <a
              href={
                "https://ropsten.etherscan.io/token/" + getContract()?.address
              }
            >
              ropsten.etherscan
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
