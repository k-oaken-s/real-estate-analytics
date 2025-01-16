import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AreaSelectorProps {
  onAreaChange: (prefecture: string, city: string) => void;
}

// 仮のデータ。後でAPIから取得するように修正可能
const PREFECTURES = [
  { id: "13", name: "東京都", cities: ["港区", "渋谷区", "新宿区"] },
  { id: "14", name: "神奈川県", cities: ["横浜市", "川崎市", "鎌倉市"] },
];

export const AreaSelector: React.FC<AreaSelectorProps> = ({ onAreaChange }) => {
  const [selectedPrefecture, setSelectedPrefecture] = React.useState<string>("");
  const [selectedCity, setSelectedCity] = React.useState<string>("");

  const handlePrefectureChange = (value: string) => {
    setSelectedPrefecture(value);
    setSelectedCity(""); // 都道府県が変更されたら市区町村をリセット
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    if (selectedPrefecture && value) {
      onAreaChange(selectedPrefecture, value);
    }
  };

  const cities = PREFECTURES.find(p => p.name === selectedPrefecture)?.cities || [];

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">エリアを選択</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedPrefecture} onValueChange={handlePrefectureChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="都道府県を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>都道府県</SelectLabel>
              {PREFECTURES.map((pref) => (
                <SelectItem key={pref.id} value={pref.name}>
                  {pref.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={selectedCity}
          onValueChange={handleCityChange}
          disabled={!selectedPrefecture}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="市区町村を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>市区町村</SelectLabel>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};