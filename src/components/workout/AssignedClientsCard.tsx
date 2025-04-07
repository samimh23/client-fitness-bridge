
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Client } from '@/lib/types';

interface AssignedClientsCardProps {
  clients: Client[];
}

const AssignedClientsCard = ({ clients }: AssignedClientsCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Users className="mr-2 h-5 w-5 text-primary" />
          Assigned Clients ({clients.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {clients.length > 0 ? (
          <div className="space-y-3">
            {clients.map(client => (
              <div key={client.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    {client.avatar ? (
                      <img src={client.avatar} alt={client.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <span className="text-lg font-medium text-gray-500">{client.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-gray-500">{client.email}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(`/clients/${client.id}`)}
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>This plan is not assigned to any clients yet.</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => navigate('/clients')}
            >
              Assign to Clients
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssignedClientsCard;
