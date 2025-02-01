'use client';

import { Property } from "@/lib/api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Building, Calendar, Home, Square, Banknote } from "lucide-react";
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface PropertyDetailProps {
    property: Property | null;
    isOpen: boolean;
    onClose: () => void;
}

export const PropertyDetail: React.FC<PropertyDetailProps> = ({
    property,
    isOpen,
    onClose,
}) => {
    if (!property) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>物件詳細</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 gap-6">
                    {/* 基本情報 */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-bold text-lg mb-4">
                            {property.type} - {property.prefecture}{property.city}{property.address}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <Banknote className="h-5 w-5 text-gray-500" />
                                <div>
                                    <div className="text-sm text-gray-500">取引価格</div>
                                    <div className="font-bold">¥{property.totalPrice.toLocaleString()}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Square className="h-5 w-5 text-gray-500" />
                                <div>
                                    <div className="text-sm text-gray-500">㎡単価</div>
                                    <div className="font-bold">¥{property.pricePerSqm.toLocaleString()}/㎡</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 物件詳細 */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <Home className="h-5 w-5 text-gray-500" />
                                <div>
                                    <div className="text-sm text-gray-500">土地面積</div>
                                    <div className="font-bold">{property.landArea}㎡</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Building className="h-5 w-5 text-gray-500" />
                                <div>
                                    <div className="text-sm text-gray-500">建物面積</div>
                                    <div className="font-bold">{property.buildingArea}㎡</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-gray-500" />
                                <div>
                                    <div className="text-sm text-gray-500">築年数</div>
                                    <div className="font-bold">{property.buildingAge}年</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-gray-500" />
                                <div>
                                    <div className="text-sm text-gray-500">取引時期</div>
                                    <div className="font-bold">
                                        {format(new Date(property.transactionDate), 'yyyy年MM月', { locale: ja })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 地図 */}
                    <div className="h-64 bg-gray-100 rounded-lg relative overflow-hidden">
                        <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            style={{ border: 0 }}
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${property.longitude - 0.01}%2C${property.latitude - 0.01}%2C${property.longitude + 0.01}%2C${property.latitude + 0.01}&layer=mapnik&marker=${property.latitude}%2C${property.longitude}`}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};