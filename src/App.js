/*
 * @Author: HanTengfeifei 1157123521@qq.com
 * @Date: 2022-09-13 14:02:00
 * @LastEditors: HanTengfeifei 1157123521@qq.com
 * @LastEditTime: 2022-09-14 10:40:43
 * @FilePath: /testweb3/src/App.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import logo from './logo.svg';
import './App.css';

import React, { useEffect, useMemo, useState } from 'react';

function App() {
  const connect = async function() {
    await window.ethereum.request({
      method: 'wallet_enable',
      params: [
        {
          wallet_snap: {
            ['npm:mq-web3']: {
              version: '^1.0.12',
            },
          },
        },
      ],
    });
  };
  const send = async function(method, payloadcus) {
    console.log('method', method);
    let payload = {
      // render: render,
      userid: 'user:cd96666ba0cded1e22a233769a0f0b638d00f5e00298590c5eb3051d039b078c',
      app_key: 'vAUJTFXbBZRkEDRE',
      metamask_signature:
        '0x6a4f202fa303270677fb4dadb979429570507525f405320b28fbc8c82217819643c3a7ba350a2b512ca26dd3e18a80cec90a523ad4cdb7fd969ffae6501b5dfc1c',
      pubkey: 'cd96666ba0cded1e22a233769a0f0b638d00f5e00298590c5eb3051d039b078c',
      sign_content:
        'Web3MQ wants you to sign in with your Ethereum account:\n    0x3c75b4f1fe09559c98f09066c0c09831d8d4fc0f\n    For Web3MQ registration\n    URI: https://www.web3mq.com\n    Version: 1\n    Nonce: 4be25c1f1ecfeba53d22b6cbf19f650060e4b3b6e01d0f68aa8106e2\n    Issued At: 06/09/2022 18:14',
      timestamp: 1662459243257,
      userid: 'user:cd96666ba0cded1e22a233769a0f0b638d00f5e00298590c5eb3051d039b078c',
      wallet_address: '0x3c75b4f1fe09559c98f09066c0c09831d8d4fc0f',
      wallet_type: 'eth',
      signContentURI: 'https://www.web3mq.com',
      env: 'test',
      app_key: 'vAUJTFXbBZRkEDRE',
      ...payloadcus,
    };
    try {
      const res = await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: [
          'npm:mq-web3',
          {
            method,
            payload,
          },
        ],
      });
      console.log('res', res);
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
    console.log('000');
  };
  // useEffect(() => {
  //   init();
  // }, []);
  const hasKeys = useMemo(() => {
    const PrivateKey = localStorage.getItem('PRIVATE_KEY') || '';
    const PublicKey = localStorage.getItem('PUBLICKEY') || '';
    if (PrivateKey && PublicKey) {
      return { PrivateKey, PublicKey };
    }
    return null;
  }, []);
  const [fastestUrl, setFastUrl] = useState(null);
  const [keys, setKeys] = useState(hasKeys);
  const signMetaMask = async function() {
    const fastUrl = await send('web3-mq-init', {
      app_key: 'vAUJTFXbBZRkEDRE',
      connectUrl: '',
      env: 'test',
    });
    console.log('fast', fastUrl);
    let result = await send('web3-mq-register', { signContentURI: 'https://www.web3mq.com' });
    console.log('result', result);
    const { PrivateKey, PublicKey } = result;
    localStorage.setItem('FAST_URL', fastUrl);
    localStorage.setItem('PRIVATE_KEY', PrivateKey);
    localStorage.setItem('PUBLICKEY', PublicKey);
    setKeys({ PrivateKey, PublicKey });
    setFastUrl(fastUrl);
    console.log('keys', PrivateKey, PublicKey);
  };
  if (!keys || !fastestUrl) {
    return (
      <React.Fragment>
        <button onClick={init}>connect</button>
        <div>
          <button onClick={signMetaMask}>signMetaMask</button>
        </div>
      </React.Fragment>
    );
  }

  return <Child send={send} keys={keys}></Child>;
}
const Child = ({ ...props }) => {
  const { send, keys } = props;
  useEffect(() => {
    generateInstance();
  }, [keys]);
  const generateInstance = async function() {
    await send('generateInstance', { keys });
  };
  return <div>child</div>;
};

export default App;
