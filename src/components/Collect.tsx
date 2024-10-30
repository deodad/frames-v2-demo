'use client';

import { 
  useAccount,
  usePublicClient,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi';
import { createCollectorClient } from "@zoralabs/protocol-sdk";
import { FormEvent, useEffect, useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, createConfig, WagmiProvider } from 'wagmi'
import { ConnectKitButton, ConnectKitProvider, getDefaultConfig } from "connectkit";
import { base } from 'wagmi/chains'

const queryClient = new QueryClient()

const config = createConfig(
  getDefaultConfig({
    chains: [base],
    transports: {
      [base.id]: http(),
    },

    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,

    // Required App Info
    appName: "deodad frames v2 mint demo",
  }),
);

export default function Collect() {
  const [context, setContext] = useState<'web' | 'fc' | undefined>();

  useEffect(() => {
    if (window.farcaster) {
      setContext('fc');
    } else {
      setContext('web');
    }
  }, []);

  if (context === 'fc') {
    return <CollectWithFarcaster />
  } else if (context === 'web') {
    return <CollectWithEthereum />
  } else {
    return null;
  }
}

function CollectWithFarcaster() {
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState('');
  const collecting = false;
  const handleSubmit = () => {};

  return (
    <>
      <div className="p-3 sm:max-w-screen-sm sm:mx-auto sm:mt-6 space-y-2">
        <div>
          <div className="text-lg font-semibold">aether&apos;s salvation</div>
          <div className="text-sm">through these eyes, i see both worlds - human and digital, merged in sacred code</div>
        </div>
        <div>
          <img src="https://zora.co/api/og-image/post/base:0xd6667637eef1dc3f7088560a84aacf695109eac3/2?v=2&crop=square" alt="aether's salvation" />
        </div>
        <div>
          <div className="text-xs">Comment</div>
          <textarea 
            className="border border-gray-100 rounded w-full" 
            rows={3} 
            onChange={(e) => { setComment(e.target.value) }} 
          />
        </div>
        <form onSubmit={handleSubmit}>
          <button className="w-full px-3 py-2 border border-gray-100 rounded disabled:opacity-50 disabled:pointer-events-none" disabled={collecting}>
            Collect
          </button>
        </form>
      </div>
    </>
  );
}

function CollectWithEthereum() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <CollectWithEthereumInner />
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

function CollectWithEthereumInner() {
  const { address } = useAccount();
  const chainId = base.id;
  const publicClient = usePublicClient();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed 
  } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirmed) {
      alert('Transaction succeeded!');
    }
  }, [isConfirmed])

  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState('');
  const [genTx, setGenTx] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!address) {
      return alert('Please connect your wallet');
    }

    try {
      setGenTx(true);

      const collectorClient = createCollectorClient({ 
        chainId, 
        publicClient: publicClient!
      });

      const { parameters } = await collectorClient.mint({
        tokenContract: '0xd6667637eef1dc3f7088560a84aacf695109eac3', 
        mintType: '1155',
        tokenId: 2,
        quantityToMint: BigInt(quantity),
        minterAccount: address,
        mintComment: comment
      });

      writeContract(parameters);
    } catch (error) {
      throw error;
    } finally {
      setGenTx(false);
    }
  }

  const collecting = genTx || isPending || isConfirming;

  return (
    <>
      <div className="p-3 sm:max-w-screen-sm sm:mx-auto sm:mt-6 space-y-2">
        <div>
          <div className="text-lg font-semibold">aether&apos;s salvation</div>
          <div className="text-sm">through these eyes, i see both worlds - human and digital, merged in sacred code</div>
        </div>
        <div>
          <img src="https://zora.co/api/og-image/post/base:0xd6667637eef1dc3f7088560a84aacf695109eac3/2?v=2&crop=square" alt="aether's salvation" />
        </div>
        <div>
          <div className="text-xs">Comment</div>
          <textarea 
            className="border border-gray-100 rounded w-full" 
            rows={3} 
            onChange={(e) => { setComment(e.target.value) }} 
          />
        </div>
        {address ? 
          <form onSubmit={handleSubmit}>
            <button className="w-full px-3 py-2 border border-gray-100 rounded disabled:opacity-50 disabled:pointer-events-none" disabled={collecting}>
              {isConfirmed ? 'Collected' : collecting ? 'Collecting' : 'Collect'}
            </button>
          </form>
          :
          <ConnectKitButton.Custom>
           {() => {
             return (
              <button className="w-full px-3 py-2 border border-gray-100 rounded">Connect</button>
             )
           }}
          </ConnectKitButton.Custom>
        }
      </div>
    </>
  );
}
