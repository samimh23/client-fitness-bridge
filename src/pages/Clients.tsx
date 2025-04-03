
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, UserPlus } from 'lucide-react';
import ClientCard from '@/components/ClientCard';
import PageTransition from '@/components/PageTransition';
import { mockClients } from '@/lib/data';
import { Client } from '@/lib/types';

const Clients = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter clients based on search query
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <PageTransition>
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Clients</h1>
            <p className="text-gray-500 mt-1">Manage and view all your clients</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild>
              <Link to="/clients/new">
                <UserPlus className="mr-2 h-4 w-4" />
                Add New Client
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search clients by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full md:max-w-md glass-card"
            />
          </div>
        </div>
        
        {/* Client List */}
        {filteredClients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map(client => (
              <ClientCard 
                key={client.id} 
                client={client}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No clients found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? "No clients match your search criteria." 
                : "You haven't added any clients yet."}
            </p>
            <Button asChild>
              <Link to="/clients/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Your First Client
              </Link>
            </Button>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Clients;
