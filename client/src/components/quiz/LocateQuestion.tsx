import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Marker, Circle } from 'react-leaflet';
import WorldMap from '@/components/map/WorldMap';
import type { LocateQuestion as LocateQuestionType } from '@/types';

interface LocateQuestionProps {
  question: LocateQuestionType;
  onAnswer: (correct: boolean) => void;
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function LocateQuestion({ question, onAnswer }: LocateQuestionProps) {
  const [clicked, setClicked] = useState<{ lat: number; lng: number } | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleMapClick = (lat: number, lng: number) => {
    if (revealed) return;
    setClicked({ lat, lng });
    setRevealed(true);

    const distance = haversineDistance(lat, lng, question.answer.lat, question.answer.lng);
    const correct = distance <= question.toleranceKm;

    setTimeout(() => {
      onAnswer(correct);
      setClicked(null);
      setRevealed(false);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{question.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <WorldMap zoom={2} onClick={handleMapClick}>
          {revealed && (
            <>
              <Circle
                center={[question.answer.lat, question.answer.lng]}
                radius={question.toleranceKm * 1000}
                pathOptions={{ color: 'green', fillOpacity: 0.1 }}
              />
              <Marker position={[question.answer.lat, question.answer.lng]} />
            </>
          )}
          {clicked && revealed && (
            <Marker position={[clicked.lat, clicked.lng]} />
          )}
        </WorldMap>
        {revealed && clicked && (
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Distance:{' '}
            {Math.round(
              haversineDistance(clicked.lat, clicked.lng, question.answer.lat, question.answer.lng),
            )}{' '}
            km — {haversineDistance(clicked.lat, clicked.lng, question.answer.lat, question.answer.lng) <= question.toleranceKm ? 'Correct !' : `Trop loin (tolerance: ${question.toleranceKm} km)`}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
