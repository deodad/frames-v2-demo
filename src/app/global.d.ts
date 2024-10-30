interface Window {
  farcaster?: {
    isAppFrame: true;
    requestTransaction: () => Promise<void>;
  }
}
