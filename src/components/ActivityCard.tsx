import Image from "next/image";
import { useState } from "react";

interface ActivityCardProps {
  image: string;
  title: string;
  location?: string;
  price?: string;
  buttonLabel?: string;
  showQuantity?: boolean;
  onButtonClick?: (quantity: number) => void;
}

export default function ActivityCard({
  image,
  title,
  location,
  price,
  buttonLabel = "Book Now",
  showQuantity = false,
  onButtonClick,
}: ActivityCardProps) {
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:scale-105 transition-transform flex flex-col">
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-6 flex flex-col gap-2 flex-1">
        <h2 className="text-xl font-semibold text-[#5B2415]">{title}</h2>
        {location && <p className="text-sm text-[#8B4513]">{location}</p>}
        <div className="mt-2 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            {price && (
              <span className="text-lg font-bold text-[#152C5B]">${price}</span>
            )}
            {showQuantity && (
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  type="button"
                >
                  -
                </button>
                <span className="px-3 py-1 bg-white text-black font-medium">
                  {quantity}
                </span>
                <button
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                  onClick={() => setQuantity(quantity + 1)}
                  type="button"
                >
                  +
                </button>
              </div>
            )}
          </div>
          <button
            className="bg-[#8B4513] hover:bg-[#5B2415] text-white px-4 py-2 rounded-lg text-sm transition w-full"
            onClick={() => onButtonClick && onButtonClick(quantity)}
            type="button"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
