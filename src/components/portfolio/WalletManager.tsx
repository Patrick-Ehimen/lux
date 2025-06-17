// components/portfolio/WalletManager.js
import React, { useState } from "react";

type Wallet = {
  name: string;
  address: string;
  addedAt: string;
};

type WalletManagerProps = {
  wallets: Wallet[];
  selectedWallet: Wallet | null;
  onAddWallet: (wallet: Wallet) => boolean;
  onRemoveWallet: (address: string) => void;
  onSelectWallet: (wallet: Wallet) => void;
};

const WalletManager: React.FC<WalletManagerProps> = ({
  wallets,
  selectedWallet,
  onAddWallet,
  onRemoveWallet,
  onSelectWallet,
}) => {
  const [newWalletName, setNewWalletName] = useState("");
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [error, setError] = useState("");

  const handleAddWallet = () => {
    setError("");

    // Validate inputs
    if (!newWalletName.trim()) {
      setError("Please enter a wallet name");
      return;
    }

    if (!newWalletAddress.trim()) {
      setError("Please enter a wallet address");
      return;
    }

    // Basic EVM address validation
    if (!/^0x[a-fA-F0-9]{40}$/.test(newWalletAddress)) {
      setError("Please enter a valid EVM wallet address");
      return;
    }

    const newWallet = {
      name: newWalletName.trim(),
      address: newWalletAddress.trim(),
      addedAt: new Date().toISOString(),
    };

    const success = onAddWallet(newWallet);

    if (success) {
      // Clear form fields
      setNewWalletName("");
      setNewWalletAddress("");
    } else {
      setError("Wallet already exists");
    }
  };

  return (
    <div className="bg-dex-bg-secondary rounded-lg p-4">
      <h2 className="text-lg font-medium mb-4">Your Wallets</h2>

      {/* Wallet list */}
      <div className="mb-6">
        {wallets.length === 0 ? (
          <div className="text-dex-text-secondary text-center py-4">
            No wallets added yet
          </div>
        ) : (
          <div className="space-y-2">
            {wallets.map((wallet: any) => (
              <div
                key={wallet.address}
                className={`flex items-center justify-between p-3 rounded cursor-pointer ${
                  selectedWallet && selectedWallet.address === wallet.address
                    ? "bg-dex-bg-highlight"
                    : "hover:bg-dex-bg-tertiary"
                }`}
                onClick={() => onSelectWallet(wallet)}
              >
                <div className="flex-1">
                  <div className="font-medium">{wallet.name}</div>
                  <div className="text-xs text-dex-text-secondary truncate">
                    {wallet.address}
                  </div>
                </div>
                <button
                  className="text-dex-text-tertiary hover:text-dex-red p-1 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveWallet(wallet.address);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add new wallet form */}
      <div className="border-t border-dex-border pt-4">
        <h3 className="text-sm font-medium mb-2">Add New Wallet</h3>

        {error && <div className="text-dex-red text-sm mb-2">{error}</div>}

        <div className="mb-3">
          <label className="block text-xs text-dex-text-secondary mb-1">
            Wallet Name
          </label>
          <input
            type="text"
            value={newWalletName}
            onChange={(e) => setNewWalletName(e.target.value)}
            placeholder="Main Wallet"
            className="w-full bg-dex-bg-tertiary border border-dex-border rounded p-2 text-dex-text-primary"
          />
        </div>

        <div className="mb-3">
          <label className="block text-xs text-dex-text-secondary mb-1">
            Wallet Address
          </label>
          <input
            type="text"
            value={newWalletAddress}
            onChange={(e) => setNewWalletAddress(e.target.value)}
            placeholder="0x..."
            className="w-full bg-dex-bg-tertiary border border-dex-border rounded p-2 text-dex-text-primary"
          />
        </div>

        <button
          onClick={handleAddWallet}
          className="w-full bg-dex-blue hover:bg-blue-600 text-white rounded py-2"
        >
          Add Wallet
        </button>
      </div>
    </div>
  );
};

export default WalletManager;
