
import { Button } from "@/components/ui/button";
import { Save, Settings } from "lucide-react";

interface ProfileHeaderProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const ProfileHeader = ({ isEditing, onEdit, onSave, onCancel }: ProfileHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold">Coach Profile</h1>
        <p className="text-gray-500 mt-1">Manage your coaching profile and settings</p>
      </div>
      {isEditing ? (
        <div className="mt-4 md:mt-0 flex gap-3">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      ) : (
        <Button onClick={onEdit}>
          <Settings className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      )}
    </div>
  );
};

export default ProfileHeader;
