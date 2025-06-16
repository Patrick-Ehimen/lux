import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchButton from "./SearchButton";
import NavigationMenu from "./NavigationMenu";
import ChainSelector from "./ChainSelector";
import Logo from "../../../assets/logo.svg";

interface LeftSidebarProps {
  openSearchModal: () => void;
}

const LeftSidebar = ({ openSearchModal }: LeftSidebarProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleChainSelect = (chainId: string) => {
    navigate(`/${chainId}`);
  };
  console.log(handleChainSelect);

  return (
    <div
      className={`flex flex-col bg-dex-bg-secondary text-dex-text-primary border-r border-dex-border h-screen sticky top-0 overflow-y-auto transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="p-4">
        <Link to="/" className="block">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <img src={Logo} alt="Whale.io Logo" className="w-8 h-8" />
              <span className={`font-bold text-lg ${isOpen ? "" : "hidden"}`}>
                Whale.io Terminal
              </span>
            </div>
            <span
              className={`text-xs text-gray-400 ml-11 ${
                isOpen ? "" : "hidden"
              }`}
            >
              DexScreener
            </span>
          </div>
        </Link>
        <SearchButton openSearchModal={openSearchModal} isOpen={isOpen} />
        <NavigationMenu isOpen={isOpen} />
        <ChainSelector isOpen={isOpen} />
      </div>
      <button
        className="absolute top-4 -right-4 bg-dex-bg-tertiary rounded-full p-2 shadow hover:bg-dex-bg-highlight transition-colors z-10"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? (
          // Left arrow for closing
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <path
              d="M13 5l-5 5 5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          // Right arrow for opening
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <path
              d="M7 5l5 5-5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default LeftSidebar;
