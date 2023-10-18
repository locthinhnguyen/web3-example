import React, { useEffect, useState } from 'react';
import { Contract, ethers } from 'ethers';
import { erc20 } from '../abis';

const Wallet = () => {
  const [data, setData] = useState({
    account: '',
    balance: null,
  });
  console.log('data: ', data);

  const btnClick = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((res) => {
          accountChangeHandle(res[0]);
        })
        .catch((err) => {
          console.log('err: ', err);
        });
    }
  };

  const getProvider = () => {
    return new ethers.providers.Web3Provider(window.ethereum, 'any');
  };

  const getBalance = async (address) => {
    window.ethereum
      .request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      })
      .then((balance) => {
        setData({
          balance: ethers.utils.formatEther(balance),
          account: address,
        });
      });

    const provider = getProvider();

    const signer = provider.getSigner(address);

    const usdtContract = new Contract(
      '0x1723b4f296E7679e249c2256289018d31470074a',
      erc20,
      signer
    );

    console.log('signer: ', signer);

    const usdt = await usdtContract.balanceOf(address);
    console.log('usdt: ', ethers.utils.formatEther(usdt));
  };

  const accountChangeHandle = (account) => {
    // localStorage.setItem('walletAddress', account);
    setData({
      account,
    });
    getBalance(account);
  };

  useEffect(() => {
    window.ethereum.on('accountsChanged', function (accounts) {
      if (accounts[0]) {
        accountChangeHandle(accounts[0]);
      }
    });
  }, []);

  useEffect(() => {
    const value = localStorage.getItem('walletAddress');
    if (value) {
      accountChangeHandle(value);
      btnClick();
    }
  }, []);

  return (
    <div className=" w-full flex justify-center flex-col">
      <button onClick={btnClick} className=" p-5 bg-blue-500 rounded-xl">
        Connect wallet
      </button>
      <div className=" flex flex-col gap-6">
        <p>{data.account}</p>
        <p>{data.balance}</p>
      </div>
    </div>
  );
};

export default Wallet;
