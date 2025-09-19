// app/components/Header/HeaderBanner.tsx - Below navigation like Smyths
import {Truck} from 'lucide-react';

export function HeaderBanner() {
  return (
    <div className="w-full bg-gray-100 text-black border-b border-gray-200">
      <div className="mx-auto flex justify-center text-sm font-medium max-w-[1272px] px-3 py-2">
        <div className="flex items-center gap-2">
          <Truck size={16} className="text-blue-600" />
          <span>Fri frakt på beställningar över 1299 kr</span>
        </div>
      </div>
    </div>
  );
}
