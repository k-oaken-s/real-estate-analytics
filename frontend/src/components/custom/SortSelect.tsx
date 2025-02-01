import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export type SortOption =
    | 'price-asc'
    | 'price-desc'
    | 'area-asc'
    | 'area-desc'
    | 'age-asc'
    | 'age-desc';

interface SortSelectProps {
    onSortChange: (sort: SortOption) => void;
    value: SortOption;
}

export const SortSelect: React.FC<SortSelectProps> = ({ onSortChange, value }) => {
    return (
        <Select value={value} onValueChange={onSortChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="並び替え" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="price-asc">価格: 安い順</SelectItem>
                <SelectItem value="price-desc">価格: 高い順</SelectItem>
                <SelectItem value="area-asc">面積: 小さい順</SelectItem>
                <SelectItem value="area-desc">面積: 大きい順</SelectItem>
                <SelectItem value="age-asc">築年数: 古い順</SelectItem>
                <SelectItem value="age-desc">築年数: 新しい順</SelectItem>
            </SelectContent>
        </Select>
    );
};