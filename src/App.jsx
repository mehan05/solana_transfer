import './App.css';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo, useState } from 'react';
import { SendSol } from './components/SendSol';
import '@solana/wallet-adapter-react-ui/styles.css';

function App() {
  const network = WalletAdapterNetwork.Devnet;
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
    <>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={[]}>
          <WalletModalProvider>
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
              <h1 className="text-4xl font-bold mb-8">Solana Transfer</h1>
              <WalletConnector
                setAddress={setAddress}
                setAmount={setAmount}
                address={address}
                amount={amount}
              />
            </div>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}

const WalletConnector = ({ setAddress, setAmount, address, amount }) => {
  const { publicKey, signTransaction, disconnect, connected } = useWallet();

  const sendSolWithArgs = () => {
    if (publicKey && signTransaction) {
      SendSol(address, parseFloat(amount), publicKey, signTransaction);
    } else {
      alert("Wallet not connected");
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
      {connected ? (
        <div>
          <h2 className="text-xl font-semibold text-center mb-4">Connected Wallet</h2>
          <div className="text-center mb-4">
            <h3 className="text-gray-600">{publicKey.toBase58()}</h3>
          </div>

          <button
            className="w-full bg-red-500 text-white py-2 px-4 rounded-lg mb-4"
            onClick={disconnect}
          >
            Disconnect
          </button>

          <div className="space-y-4">
            <input
              type="text"
              className="w-full p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Recipient address"
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              type="text"
              className="w-full p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Amount (SOL)"
              onChange={(e) => setAmount(e.target.value)}
            />
            <button
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg"
              onClick={() => sendSolWithArgs()}
            >
              Send SOL
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <WalletMultiButton />
        </div>
      )}
    </div>
  );
};

export default App;
