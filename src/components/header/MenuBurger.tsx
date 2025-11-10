import { MenuOutlined } from "@ant-design/icons";
import React from "react";

interface BurgerProps {
  className?: string;
  onClick: () => void;
  isOpen: boolean;
}

export const MenuBurger: React.FC<BurgerProps> = ({ className, onClick }) => (
  <button
    className={`flex flex-col rounded-lg h-10 w-10 border border-zinc-600 hover:bg-purple-100 transition duration-200 justify-center items-center group z-40 ${className}`}
    onClick={onClick}
  >
    <MenuOutlined className="text-xl" />
  </button>
);
