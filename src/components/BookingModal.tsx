
import React, { useState, useEffect } from 'react';
import { X, Calendar, CheckCircle, ChevronRight, Loader2, AlertTriangle, FileText, MessageSquare, Clock } from 'lucide-react';
import { api } from '../services/api';
import { Facility, AvailabilitySlot } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface BookingModalProps {
  facility: Facility;
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ facility, isOpen, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [duration, setDuration] = useState<string>('1h');
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [error, setError] = useState<string | null>(null);

  // New Fields
  const [equipmentNeeded, setEquipmentNeeded] = useState('');
  const [medicalConcerns, setMedicalConcerns] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep(1);
      setError(null);
      setEquipmentNeeded('');
      setMedicalConcerns('');
      setDuration('1h');
      setSelectedSlot(null);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (selectedDate) {
      setLoading(true);
      api.facilities.getAvailability(facility.id, selectedDate)
        .then((data) => {
          setSlots(data);
          setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }
  }, [selectedDate, facility.id]);

  // Check if a slot sequence is valid based on duration
  const isSlotBlocked = (slotTime: string) => {
    const slotIndex = slots.findIndex(s => s.time === slotTime);
    if (slotIndex === -1) return true;

    let slotsNeeded = 1;
    if (duration === '1.5h') slotsNeeded = 2;
    if (duration === '2h') slotsNeeded = 2;
    if (duration === '3h') slotsNeeded = 3;

    for (let i = 0; i < slotsNeeded; i++) {
        const nextSlot = slots[slotIndex + i];
        if (!nextSlot || !nextSlot.available) {
            return true;
        }
    }
    return false;
  };

  const handleBook = async () => {
    if (!user) {
        onClose();
        navigate('/signin');
        return;
    }

    setLoading(true);
    setError(null);
    
    try {
        await api.bookings.create({
            facilityId: facility.id,
            facilityName: facility.name,
            userId: user.id,
            userName: user.email || 'User',
            userPhone: user.user_metadata?.phone_number || '', // Pass the phone number from profile
            date: selectedDate,
            startTime: selectedSlot!,
            endTime: duration,
            equipmentNeeded: equipmentNeeded,
            medicalConcerns: medicalConcerns
        });
        setLoading(false);
        setStep(3);
    } catch (err: any) {
        console.error(err);
        // Display specific overlap messages if they come from the API
        if (err.message && (err.message.includes("overlap") || err.message.includes("taken"))) {
            setError(err.message);
        } else {
            setError("Failed to create booking. Please check your connection and try again.");
        }
        setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-surface border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
          <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
            <span className="text-primary">Book Session:</span> {facility.name}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
          {!user && (
            <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <p className="text-sm text-gray-300">You must be signed in to confirm a booking.</p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-3">Select Date</label>
                    <div className="relative">
                    <input 
                        type="date" 
                        className="w-full bg-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        onChange={(e) => {
                            setSelectedDate(e.target.value);
                            setSelectedSlot(null); // Reset slot on date change
                        }}
                        min={new Date().toISOString().split('T')[0]}
                    />
                    <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-3">Duration</label>
                    <div className="relative">
                        <select 
                            className="w-full bg-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none appearance-none cursor-pointer"
                            value={duration}
                            onChange={(e) => {
                                setDuration(e.target.value);
                                setSelectedSlot(null); // Reset slot on duration change
                            }}
                        >
                            <option value="1h">1 Hour</option>
                            <option value="1.5h">1.5 Hours</option>
                            <option value="2h">2 Hours</option>
                            <option value="3h">3 Hours</option>
                        </select>
                        <Clock className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
                    </div>
                </div>
              </div>

              {selectedDate && (
                <div className="animate-fade-in">
                  <label className="block text-sm font-medium text-gray-400 mb-3">Available Start Times</label>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {slots.map((slot, idx) => {
                        const blocked = isSlotBlocked(slot.time);
                        return (
                        <button
                          key={idx}
                          disabled={blocked}
                          onClick={() => setSelectedSlot(slot.time)}
                          className={`
                            px-2 py-3 rounded-lg text-sm font-medium transition-all duration-200 border
                            ${blocked
                              ? 'bg-white/5 border-transparent text-gray-600 cursor-not-allowed decoration-slice' 
                              : selectedSlot === slot.time
                                ? 'bg-primary text-black border-primary shadow-neon transform scale-105'
                                : 'bg-surfaceHighlight border-white/5 text-gray-300 hover:border-primary/50 hover:text-white'
                            }
                          `}
                        >
                          {slot.time}
                        </button>
                      )})}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">*Slots that cannot accommodate the selected duration are disabled.</p>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-surfaceHighlight rounded-2xl p-4 border border-white/5">
                      <p className="text-gray-400 text-xs mb-1">Date</p>
                      <p className="text-white font-bold text-sm">{selectedDate}</p>
                  </div>
                  <div className="bg-surfaceHighlight rounded-2xl p-4 border border-white/5">
                      <p className="text-gray-400 text-xs mb-1">Time</p>
                      <p className="text-primary font-mono text-sm">{selectedSlot} ({duration})</p>
                  </div>
                  <div className="bg-surfaceHighlight rounded-2xl p-4 border border-white/5">
                      <p className="text-gray-400 text-xs mb-1">Rate</p>
                      <p className="text-white font-bold text-sm">${facility.hourlyRate}/hr</p>
                  </div>
               </div>

              {/* Additional Details Form */}
              <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Equipment Required <span className="text-gray-500">(Optional)</span></label>
                    <textarea 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-all placeholder-gray-600"
                        rows={2}
                        placeholder="E.g. Yoga mats, Squat rack..."
                        value={equipmentNeeded}
                        onChange={(e) => setEquipmentNeeded(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1 italic">Note: Availability of specific equipment is not guaranteed.</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Medical Concerns <span className="text-gray-500">(Optional)</span></label>
                    </div>
                    <textarea 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-all placeholder-gray-600"
                        rows={2}
                        placeholder="Any injuries or conditions our staff should be aware of?"
                        value={medicalConcerns}
                        onChange={(e) => setMedicalConcerns(e.target.value)}
                    />
                  </div>
              </div>

              {error && (
                  <div className="bg-red-500/10 text-red-500 text-sm p-3 rounded-lg border border-red-500/20">
                      {error}
                  </div>
              )}

              {/* Invoice & WhatsApp Disclaimer */}
              <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 space-y-3">
                 <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-gray-200 font-bold">Invoice Generation</p>
                        <p className="text-xs text-gray-400">A detailed invoice will be generated and sent to your email upon confirmation.</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-gray-200 font-bold">WhatsApp Confirmation</p>
                        <p className="text-xs text-gray-400">You will also receive booking details and the invoice via WhatsApp.</p>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(14,169,95,0.3)]">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-3xl font-display font-bold text-white mb-4">Request Received!</h3>
              <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                Your booking request has been sent. You will receive the email and WhatsApp confirmation shortly.
              </p>
              <button 
                onClick={onClose}
                className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-full transition-all"
              >
                Return to Facility
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {step < 3 && (
          <div className="p-6 border-t border-white/5 bg-bg/50 backdrop-blur flex justify-between">
            <button 
              onClick={() => step > 1 ? setStep(step - 1) : onClose()}
              className="px-6 py-3 rounded-xl text-gray-400 font-medium hover:text-white transition-colors"
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </button>
            <button 
              disabled={step === 1 && (!selectedDate || !selectedSlot)}
              onClick={() => {
                  if (step === 1) {
                      setStep(2);
                  } else {
                      handleBook();
                  }
              }}
              className={`
                px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg
                ${step === 1 && (!selectedDate || !selectedSlot)
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-primary text-black hover:bg-white hover:shadow-neon transform hover:-translate-y-0.5'
                }
              `}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <>
                  {step === 1 ? 'Next Details' : (user ? 'Confirm Booking' : 'Sign In to Book')}
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
