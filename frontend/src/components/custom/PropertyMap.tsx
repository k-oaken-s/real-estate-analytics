'use client';

import { useState } from 'react';
import { Property } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PropertyDetail } from "./PropertyDetail";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leafletのデフォルトアイコンのパス問題を修正
const icon = L.icon({
    iconUrl: '/images/marker-icon.png',
    shadowUrl: '/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface PropertyMapProps {
    properties: Property[];
    center?: [number, number];
}

export const PropertyMap: React.FC<PropertyMapProps> = ({
    properties,
    center = [35.6628, 139.7317], // 東京都港区付近
}) => {
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

    return (
        <><Card>
            <CardHeader>
                <CardTitle>取引物件マップ</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[400px] w-full">
                    <MapContainer
                        center={center}
                        zoom={14}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
                        {properties.map((property, index) => (
                            <Marker
                                key={index}
                                position={[property.latitude, property.longitude]}
                                icon={icon}
                            >
                                <Popup>
                                    <div>
                                        <h3 className="font-bold">{property.address}</h3>
                                        <p>価格: ¥{property.totalPrice.toLocaleString()}</p>
                                        <p>㎡単価: ¥{property.pricePerSqm.toLocaleString()}</p>
                                        <p>面積: {property.landArea}㎡</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </CardContent>
            <MapContainer
                center={center}
                zoom={14}
                style={{ height: '400px', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
                {properties.map((property, index) => (
                    <Marker
                        key={index}
                        position={[property.latitude, property.longitude]}
                        icon={icon}
                        eventHandlers={{
                            click: () => setSelectedProperty(property),
                        }}
                    >
                        <Popup>
                            <div>
                                <h3 className="font-bold">{property.address}</h3>
                                <p>価格: ¥{property.totalPrice.toLocaleString()}</p>
                                <p>㎡単価: ¥{property.pricePerSqm.toLocaleString()}</p>
                                <p>面積: {property.landArea}㎡</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

        </Card><PropertyDetail
                property={selectedProperty}
                isOpen={!!selectedProperty}
                onClose={() => setSelectedProperty(null)} />
        </>
    );
};