import React from "react";

type MarkerProps = {
  lat: number;
  lng: number;
  text: string;
  onClick?: () => void;
};

const Marker: React.FC<MarkerProps> = ({ text, onClick }) => (
  <div
    title={text}
    onClick={onClick}
    className={`absolute top-1/2 left-1/2 w-[18px] h-[18px] 
      bg-black border-2 border-white rounded-full select-none 
      -translate-x-1/2 -translate-y-1/2 
      ${onClick ? "cursor-pointer hover:z-10" : "cursor-default"}`}
  />
);

export default Marker;