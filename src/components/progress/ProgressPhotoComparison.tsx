import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Calendar, ArrowLeftRight } from 'lucide-react';
import { ProgressPhoto } from '@/lib/types';

interface ProgressPhotoComparisonProps {
  photos: ProgressPhoto[];
  onAddPhoto: () => void;
}

const ProgressPhotoComparison = ({ photos, onAddPhoto }: ProgressPhotoComparisonProps) => {
  const [selectedType, setSelectedType] = useState<'front' | 'side' | 'back'>('front');
  const [comparisonMode, setComparisonMode] = useState(false);

  const photosByType = photos.filter(photo => photo.type === selectedType).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const latestPhoto = photosByType[0];
  const oldestPhoto = photosByType[photosByType.length - 1];

  const renderPhotoCard = (photo: ProgressPhoto, label: string) => (
    <div className="space-y-2">
      <div className="relative">
        <img
          src={photo.imageUrl}
          alt={`Progress photo - ${photo.type}`}
          className="w-full h-64 object-cover rounded-lg border"
        />
        <Badge className="absolute top-2 left-2 bg-background/80">
          {label}
        </Badge>
      </div>
      <div className="text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {new Date(photo.date).toLocaleDateString()}
        </div>
        {photo.notes && <p className="mt-1">{photo.notes}</p>}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Progress Photos
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={comparisonMode ? "default" : "outline"}
              size="sm"
              onClick={() => setComparisonMode(!comparisonMode)}
              disabled={photosByType.length < 2}
            >
              <ArrowLeftRight className="h-4 w-4 mr-1" />
              Compare
            </Button>
            <Button onClick={onAddPhoto} size="sm">
              <Camera className="h-4 w-4 mr-1" />
              Add Photo
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Photo Type Selector */}
          <div className="flex gap-2">
            {(['front', 'side', 'back'] as const).map(type => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type)}
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>

          {/* Photo Display */}
          {photosByType.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No {selectedType} photos yet</p>
              <Button onClick={onAddPhoto} variant="outline" size="sm" className="mt-2">
                Add Your First Photo
              </Button>
            </div>
          ) : comparisonMode && photosByType.length >= 2 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderPhotoCard(oldestPhoto, 'Before')}
              {renderPhotoCard(latestPhoto, 'Latest')}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {photosByType.map(photo => (
                <div key={photo.id}>
                  {renderPhotoCard(photo, new Date(photo.date).toLocaleDateString())}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressPhotoComparison;