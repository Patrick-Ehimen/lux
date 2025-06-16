// components/layout/LeftSidebar/ChainSelector.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CHAINS, CHAIN_PATH_MAP } from "../../../constant";

interface ChainSelectorProps {
  isOpen: boolean;
}

const ChainSelector: React.FC<ChainSelectorProps> = ({ isOpen }) => {
  const [selectedChain, setSelectedChain] = useState("");
  const navigate = useNavigate();

  // Define the supported chains with their display names and IDs

  const handleChainClick = (chainId: string) => {
    setSelectedChain(chainId);

    // If "All Chains" is selected, go to homepage
    if (!chainId) {
      navigate("/");
    } else {
      // Otherwise navigate to the chain-specific page
      const pathSegment = CHAIN_PATH_MAP[chainId] || chainId;
      navigate(`/${pathSegment}`);
    }
  };

  return (
    <div className="mt-6">
      <h3
        className={`text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4 ${
          isOpen ? "" : "hidden"
        }`}
      >
        Networks
      </h3>
      <nav className="space-y-px">
        {CHAINS.map((chain) => (
          <div>
            <button
              key={chain.id}
              onClick={() => handleChainClick(chain.id)}
              className={`flex items-center px-4 py-3 text-sm w-full text-left ${
                selectedChain === chain.id
                  ? "bg-dex-bg-highlight"
                  : "hover:bg-dex-bg-tertiary"
              } transition-colors ${isOpen ? "" : "hidden"}`}
            >
              <img
                src={chain.icon}
                alt={`${chain.name} icon`}
                className="w-5 h-5 mr-3"
              />
              <span className={`${isOpen ? "" : "hidden"}`}>{chain.name}</span>
            </button>
            <div
              className={`py-1 ${isOpen ? "hidden" : ""}`}
              onClick={() => handleChainClick(chain.id)}
            >
              <img
                src={chain.icon}
                alt={`${chain.name} icon`}
                className="w-[22px] h-[22px] my-2 ml-2"
              />
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default ChainSelector;
