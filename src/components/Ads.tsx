import Image from "next/image";
import { useState } from "react";

interface AdvertisementProps {
  image: string;
}

export default function Ads({
  image,

}: AdvertisementProps) {
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:scale-105 transition-transform flex flex-col">
      <div className="relative min-h-screen w-full">
        <Image
          src={image}
          alt={"#"}
          fill
          className="object-fill"
          
        />
      </div>
    </div>
    
  );
}
