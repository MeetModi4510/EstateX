import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Phone, Mail, MapPin, Building2, Flame, Calendar, Clock, 
  FileText, CheckCircle2, ChevronRight, Plus
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ScheduleVisitModal } from '../../components/broker/crm/ScheduleVisitModal';
import { fetchBrokerLeadById, fetchLeadNotes, addLeadNote, updateLeadStatus } from '../../api/client';

export const LeadDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'notes' | 'timeline' | 'followup'>('notes');
  const [notes, setNotes] = useState('');
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [lead, setLead] = useState<any>(null);
  const [leadNotes, setLeadNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      Promise.all([
        fetchBrokerLeadById(id),
        fetchLeadNotes(id)
      ])
      .then(([leadData, notesData]) => {
        setLead(leadData);
        setLeadNotes(notesData);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
    }
  }, [id]);

  const handleStatusChange = async () => {
    const nextStatus = prompt("Enter next status (e.g., CONTACTED, NEGOTIATION, DEAL_COMPLETED):", lead?.status);
    if (nextStatus && id) {
      try {
        const updated = await updateLeadStatus(id, nextStatus);
        setLead(updated);
      } catch (err) {
        console.error("Failed to update status");
      }
    }
  };

  const handleAddNote = async () => {
    if (!notes.trim() || !id) return;
    try {
      const newNote = await addLeadNote(id, notes);
      setLeadNotes([newNote, ...leadNotes]);
      setNotes('');
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return <div className="p-20 text-center">Loading Lead Details...</div>;
  }

  if (!lead) {
    return <div className="p-20 text-center">Lead not found.</div>;
  }



  return (
    <div className="w-full bg-neutral-bg pb-24 pt-24 min-h-screen">
      <div className="container-custom">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-neutral-secondary hover:text-primary transition-colors mb-6 font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Leads
        </button>

        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-neutral-primary">{lead.buyerName}</h1>
            <p className="text-neutral-secondary">Lead ID: {lead._id} • Registered {new Date(lead.createdAt).toLocaleDateString()}</p>
            <p className="font-bold text-primary text-sm mt-1">Status: {lead.status}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-primary text-white gap-2" onClick={() => setIsVisitModalOpen(true)}>
              <Calendar className="w-4 h-4" /> Schedule Visit
            </Button>
            <Button variant="outline" className="gap-2 text-primary border-primary hover:bg-primary/5" onClick={handleStatusChange}>
              Change Status
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Buyer Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm">
              <h2 className="text-xl font-bold text-neutral-primary mb-6">Buyer Profile</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-neutral-secondary uppercase tracking-wider mb-1">Contact Details</p>
                  <p className="font-medium text-neutral-primary flex items-center gap-2"><Phone className="w-4 h-4 text-neutral-secondary"/> {lead.buyerPhone}</p>
                  <p className="font-medium text-neutral-primary flex items-center gap-2 mt-2"><Mail className="w-4 h-4 text-neutral-secondary"/> {lead.buyerEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-secondary uppercase tracking-wider mb-1">Lead Score</p>
                  <div className="flex items-center gap-2 text-orange-500 font-bold bg-orange-50 px-3 py-1.5 rounded-lg w-max">
                    <Flame className="w-5 h-5" /> {lead.leadScore || 50} / 100
                  </div>
                </div>
                <div>
                  <p className="text-xs text-neutral-secondary uppercase tracking-wider mb-1">Budget</p>
                  <p className="font-bold text-lg text-primary">{lead.budget}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-secondary uppercase tracking-wider mb-1">Preferred Time</p>
                  <p className="font-medium text-neutral-primary flex items-center gap-2"><Clock className="w-4 h-4 text-neutral-secondary"/> {lead.preferredContactTime || 'Anytime'}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-neutral-divider">
                <p className="text-xs text-neutral-secondary uppercase tracking-wider mb-2">Buyer Requirements / Message</p>
                <div className="bg-neutral-bg-secondary p-4 rounded-xl border border-neutral-divider text-sm text-neutral-primary leading-relaxed">
                  "{lead.message || 'No additional requirements provided.'}"
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm">
              <h2 className="text-xl font-bold text-neutral-primary mb-4">Property Interested In</h2>
              <div className="flex items-center justify-between p-4 border border-neutral-divider rounded-xl hover:border-primary/30 transition-colors cursor-pointer group" onClick={() => navigate(`/property/${lead.propertyId?._id}`)}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-primary group-hover:text-primary transition-colors">{lead.propertyId?.title}</h3>
                    <p className="text-sm text-neutral-secondary">{lead.propertyId?.locality}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-secondary group-hover:text-primary transition-colors" />
              </div>
            </div>
          </div>

          {/* Right Column: CRM Tools */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-neutral-border shadow-sm overflow-hidden flex flex-col h-[600px]">
              
              <div className="flex border-b border-neutral-divider">
                <button 
                  className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'notes' ? 'border-primary text-primary' : 'border-transparent text-neutral-secondary hover:text-neutral-primary'}`}
                  onClick={() => setActiveTab('notes')}
                >
                  Notes
                </button>
                <button 
                  className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'timeline' ? 'border-primary text-primary' : 'border-transparent text-neutral-secondary hover:text-neutral-primary'}`}
                  onClick={() => setActiveTab('timeline')}
                >
                  Timeline
                </button>
                <button 
                  className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'followup' ? 'border-primary text-primary' : 'border-transparent text-neutral-secondary hover:text-neutral-primary'}`}
                  onClick={() => setActiveTab('followup')}
                >
                  Follow-ups
                </button>
              </div>

              <div className="flex-1 p-5 overflow-y-auto custom-scrollbar bg-neutral-bg-secondary">
                {activeTab === 'notes' && (
                  <div className="space-y-4 h-full flex flex-col">
                    <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                      {leadNotes.length === 0 ? (
                        <p className="text-sm text-neutral-secondary text-center mt-4">No notes added yet.</p>
                      ) : (
                        leadNotes.map((n: any) => (
                          <div key={n._id} className="bg-white p-3 rounded-xl border border-neutral-divider shadow-sm">
                            <p className="text-sm text-neutral-primary mb-2 whitespace-pre-wrap">{n.note}</p>
                            <p className="text-xs text-neutral-secondary flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(n.createdAt).toLocaleString()}</p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="mt-4 shrink-0">
                      <textarea 
                        className="w-full bg-white border border-neutral-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary resize-none h-20 mb-2"
                        placeholder="Add a private note..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                      <Button className="w-full h-10 text-sm gap-2" onClick={handleAddNote}><Plus className="w-4 h-4"/> Add Note</Button>
                    </div>
                  </div>
                )}

                {activeTab === 'timeline' && (
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-divider before:to-transparent">
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-green-100 text-green-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-neutral-divider shadow-sm">
                        <div className="flex items-center justify-between space-x-2 mb-1">
                          <div className="font-bold text-neutral-primary text-sm">Visit Scheduled</div>
                          <time className="text-xs font-medium text-neutral-secondary">Today</time>
                        </div>
                        <div className="text-sm text-neutral-secondary">Visit confirmed for Sunday at 11 AM.</div>
                      </div>
                    </div>
                    
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-100 text-blue-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-neutral-divider shadow-sm">
                        <div className="flex items-center justify-between space-x-2 mb-1">
                          <div className="font-bold text-neutral-primary text-sm">Contacted</div>
                          <time className="text-xs font-medium text-neutral-secondary">Yesterday</time>
                        </div>
                        <div className="text-sm text-neutral-secondary">Initial discovery call completed.</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'followup' && (
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                      <div className="flex items-center gap-2 text-orange-600 font-bold mb-2 text-sm">
                        <Clock className="w-4 h-4" /> Upcoming Follow-up
                      </div>
                      <p className="text-neutral-primary font-medium text-sm mb-1">{lead.nextFollowup}</p>
                      <p className="text-neutral-secondary text-xs">Call to confirm the visit details and send location pin.</p>
                      <div className="mt-3 flex gap-2">
                        <Button className="h-8 text-xs bg-orange-500 hover:bg-orange-600 border-none text-white px-4">Mark Done</Button>
                        <Button variant="outline" className="h-8 text-xs px-4 bg-white">Reschedule</Button>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full border-dashed"><Plus className="w-4 h-4 mr-2"/> Add New Follow-up</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ScheduleVisitModal 
        isOpen={isVisitModalOpen} 
        onClose={() => setIsVisitModalOpen(false)} 
        buyerName={lead.buyerName}
        propertyTitle={lead.propertyId?.title}
        leadId={lead._id}
        propertyId={lead.propertyId?._id}
      />
    </div>
  );
};
