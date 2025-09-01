import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Calendar } from 'lucide-react';
import { ProgressPhoto } from '@/lib/types';

interface ProgressPhotoComparisonProps {
  photos: ProgressPhoto[];
  onAddPhoto: () => void;
}

const ProgressPhotoComparison = ({ photos, onAddPhoto }: ProgressPhotoComparisonProps) => {
  const sortedPhotos = photos.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Progress Photos
          </CardTitle>
          <Button onClick={onAddPhoto} size="sm">
            <Camera className="h-4 w-4 mr-1" />
            Add Photo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {sortedPhotos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No progress photos yet</p>
            <Button onClick={onAddPhoto} variant="outline" size="sm" className="mt-2">
              Add First Photo
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedPhotos.map(photo => (
              <div key={photo.id} className="flex gap-4 p-4 border rounded-lg">
                <img
                  src={photo.imageUrl}
                  alt="Progress photo"
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {new Date(photo.date).toLocaleDateString()}
                    </span>
                  </div>
                  {photo.notes && (
                    <p className="text-sm text-muted-foreground">{photo.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressPhotoComparison;