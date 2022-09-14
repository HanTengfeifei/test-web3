/*
 * @Author: HanTengfeifei 1157123521@qq.com
 * @Date: 2022-09-13 14:02:00
 * @LastEditors: HanTengfeifei 1157123521@qq.com
 * @LastEditTime: 2022-09-14 10:40:43
 * @FilePath: /testweb3/src/App.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import logo from "./logo.svg";
import "./App.css";

import React, { useEffect, useMemo, useState } from "react";

function App() {
  const connect = async function () {
    let e = window.ethereum;
    await e.request({
      method: "wallet_enable",
      params: [
        {
          wallet_snap: {
            ["npm:mq-web3"]: {
              version: "^1.0.16",
            },
          },
        },
      ],
    });
    console.log("ethereum3", window.ethereum);
  };
  const send = async function (method, payloadcus) {
    console.log("method", method);
    let payload = {
      // render: render,
      userid:
        "user:cd96666ba0cded1e22a233769a0f0b638d00f5e00298590c5eb3051d039b078c",
      app_key: "vAUJTFXbBZRkEDRE",
      metamask_signature:
        "0x6a4f202fa303270677fb4dadb979429570507525f405320b28fbc8c82217819643c3a7ba350a2b512ca26dd3e18a80cec90a523ad4cdb7fd969ffae6501b5dfc1c",
      pubkey:
        "cd96666ba0cded1e22a233769a0f0b638d00f5e00298590c5eb3051d039b078c",
      sign_content:
        "Web3MQ wants you to sign in with your Ethereum account:\n    0x3c75b4f1fe09559c98f09066c0c09831d8d4fc0f\n    For Web3MQ registration\n    URI: https://www.web3mq.com\n    Version: 1\n    Nonce: 4be25c1f1ecfeba53d22b6cbf19f650060e4b3b6e01d0f68aa8106e2\n    Issued At: 06/09/2022 18:14",
      timestamp: 1662459243257,
      userid:
        "user:cd96666ba0cded1e22a233769a0f0b638d00f5e00298590c5eb3051d039b078c",
      wallet_address: "0x3c75b4f1fe09559c98f09066c0c09831d8d4fc0f",
      wallet_type: "eth",
      signContentURI: "https://www.web3mq.com",
      env: "test",
      app_key: "vAUJTFXbBZRkEDRE",
      ...payloadcus,
    };
    try {
      const res = await window.ethereum.request({
        method: "wallet_invokeSnap",
        params: [
          "npm:mq-web3",
          {
            method,
            payload,
          },
        ],
      });
      console.log("res", res);
      if (!res) return;
      return res;
    } catch (err) {
      console.error(err);
      alert(`Problem happened: ${err.message}` || err);
    }
  };

  const init = async () => {
    // const fastUrl = await Client.init({
    //   connectUrl: localStorage.getItem('FAST_URL'),
    //   app_key: 'vAUJTFXbBZRkEDRE',
    // });
    // localStorage.setItem('FAST_URL', fastUrl);
    // setFastUrl(fastUrl);
    await connect();
    console.log("000");
  };
  // useEffect(() => {
  //   init();
  // }, []);
  const hasKeys = useMemo(() => {
    const PrivateKey = localStorage.getItem("PRIVATE_KEY") || "";
    const PublicKey = localStorage.getItem("PUBLICKEY") || "";
    if (PrivateKey && PublicKey) {
      return { PrivateKey, PublicKey };
    }
    return null;
  }, []);
  const [fastestUrl, setFastUrl] = useState(null);
  const [keys, setKeys] = useState(hasKeys);
  const signMetaMask = async function () {
    await init();
    const fastUrl = await send("web3-mq-init", {
      app_key: "vAUJTFXbBZRkEDRE",
      connectUrl: "",
      env: "test",
    });
    console.log("fast", fastUrl);
    let result = await send("web3-mq-register", {
      signContentURI: "https://www.web3mq.com",
    });
    console.log("result", result);
    const { PrivateKey, PublicKey } = result;
    localStorage.setItem("FAST_URL", fastUrl);
    localStorage.setItem("PRIVATE_KEY", PrivateKey);
    localStorage.setItem("PUBLICKEY", PublicKey);
    setKeys({ PrivateKey, PublicKey });
    setFastUrl(fastUrl);
    console.log("keys", PrivateKey, PublicKey);
  };
  if (!keys || !fastestUrl) {
    return (
      <React.Fragment>
        {/* <button onClick={init}>connect</button> */}
        <div>
          <button onClick={signMetaMask}>signMetaMask</button>
        </div>
      </React.Fragment>
    );
  }

  return (
    <div>
      <Child send={send} keys={keys}></Child>
    </div>
  );
}
const Child = ({ ...props }) => {
  const { send, keys } = props;
  const [list, setList] = useState(null);
  const [activeChannel, setCurrentActiveChannel] = useState(null);
  const [text, setText] = useState("");
  const [messageList, setMessageList] = useState([]);
  // useEffect(() => {
  //   generateInstance();
  // }, [keys]);
  const generateInstance = async function () {
    return await send("getInstance", { keys });
  };
  const addInstanceListeners = async function () {
    return await send("addInstanceListeners", {});
  };
  const queryChannelList = async function () {
    return await send("queryChannelList", {});
  };
  const getChannelList = async function () {
    return await send("getChannelList", {});
  };
  const setActiveChannel = async function (payload) {
    return await send("setActiveChannel", { ...payload });
  };
  const getActiveChannel = async function () {
    return await send("getActiveChannel", {});
  };
  const getClientMessageList = async function () {
    return await send("getClientMessageList", {});
  };
  const sendMessage = async function (payload) {
    return await send("handleSendMessage", { ...payload });
  };
  const creatClient = async function () {
    await generateInstance();
    await addInstanceListeners();
    await queryChannelList();
    let list = await getChannelList();
    setList(list);
  };
  useEffect(() => {
    creatClient();
  }, [keys]);
  const intervalFuction = async function () {
    let activeChannel = await getActiveChannel();
    if (activeChannel) {
      let msgList = await getClientMessageList();
      setMessageList(msgList);
    }
  };
  useEffect(() => {
    let timer = setInterval(() => {
      intervalFuction();
    }, 2000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  const handleChangeActive = async function (channel) {
    await setActiveChannel({ channel });
    let activeChannel = await getActiveChannel();
    if (activeChannel) {
      let msgList = await getClientMessageList();
      setMessageList(msgList);
      setCurrentActiveChannel(activeChannel);
    }
  };
  const handleSendMessage = async function () {
    setText("");
    await sendMessage(text);
  };
  const createRoom = async function () {
    await send("creatRoom", {});
    // await queryChannelList();
    let list = await getChannelList();
    setList(list);
  };
  const List = () => {
    if (!list) {
      return null;
    }
    return (
      <ul>
        {list.map((item, idx) => {
          return (
            <li
              style={{ cursor: "pointer" }}
              key={item.topic}
              onClick={() => handleChangeActive(item)}
            >
              {idx}-{item.topic}
            </li>
          );
        })}
      </ul>
    );
  };
  return (
    <div>
      <button
        onClick={() => {
          createRoom();
        }}
      >
        create Room
      </button>
      <h1>room list</h1>
      <List />
      <h1>message list</h1>
      {activeChannel && (
        <div>
          <div>
            <b>activeChannel:</b>
            <span style={{ color: "blue" }}>{activeChannel.topic}</span>
          </div>
          <div style={{ minHeight: 300, border: "1px solid #000" }}>
            {messageList.map((item) => {
              return <div key={item.id}>message: {item.content}</div>;
            })}
          </div>
          <div>
            <input
              value={text}
              type="text"
              onChange={(e) => {
                setText(e.target.value);
              }}
            />
            <button onClick={handleSendMessage}>send Message</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
