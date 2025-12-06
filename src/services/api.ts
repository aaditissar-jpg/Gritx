
import { Facility, Event, MembershipPlan, Booking, AvailabilitySlot } from '../types';
import { FACILITIES_DATA, EVENTS_DATA, MEMBERSHIPS_DATA } from '../constants';
import { supabase } from '../lib/supabaseClient';

const DELAY_MS = 600;
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Convert various time strings to minutes since midnight
const toMinutes = (time: string) => {
    if (!time) return NaN;
    const normalized = time.trim().toLowerCase();

    // Handle ISO-like strings e.g. "2025-02-01T21:00:00+00:00"
    const isoMatch = normalized.match(/t(\d{2}):(\d{2})/);
    if (isoMatch) {
        const hour = parseInt(isoMatch[1], 10);
        const minutes = parseInt(isoMatch[2], 10) || 0;
        return hour * 60 + minutes;
    }

    // Handle native Date parsing fallback (covers cases like "2025-02-01 21:00:00")
    const asDate = new Date(time);
    if (!Number.isNaN(asDate.getTime())) {
        return asDate.getHours() * 60 + asDate.getMinutes();
    }

    // Handle formats like "10:00 pm" or "10:00 AM"
    const ampmMatch = normalized.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(am|pm)$/);
    if (ampmMatch) {
        let hour = parseInt(ampmMatch[1], 10);
        const minutes = parseInt(ampmMatch[2], 10) || 0;
        const period = ampmMatch[3];
        if (period === 'pm' && hour !== 12) hour += 12;
        if (period === 'am' && hour === 12) hour = 0;
        return hour * 60 + minutes;
    }

    // Handle plain HH:MM or HH:MM:SS (Supabase can return seconds)
    const parts = normalized.split(':');
    if (parts.length >= 2) {
        const hour = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10) || 0;
        if (!Number.isNaN(hour) && !Number.isNaN(minutes)) {
            return hour * 60 + minutes;
        }
    }

    // Handle plain hour strings like "10"
    const numericHour = parseInt(normalized, 10);
    if (!Number.isNaN(numericHour)) {
        return numericHour * 60;
    }

    return NaN;
};

// Helper: derive a booking window in minutes, tolerating duration strings (e.g. "2h")
const getBookingWindow = (start: string, endOrDuration: string) => {
    const startMin = toMinutes(start);

    // End might be an actual clock time or a duration label
    let endMin: number;
    const durationLookup: Record<string, number> = {
        '1h': 60,
        '1.5h': 90,
        '2h': 120,
        '3h': 180,
    };
    const durationMatch = endOrDuration?.match(/^(\d+(?:\.\d+)?)\s*h/);
    if (durationLookup[endOrDuration]) {
        endMin = startMin + durationLookup[endOrDuration];
    } else if (durationMatch) {
        endMin = startMin + Math.round(parseFloat(durationMatch[1]) * 60);
    } else {
        endMin = toMinutes(endOrDuration);
    }

    // Fallback: assume 1 hour if we still couldn't parse
    if (Number.isNaN(endMin) && !Number.isNaN(startMin)) {
        endMin = startMin + 60;
    }

    return { startMin, endMin };
};

// Helper: Convert minutes to "HH:MM"
const toTimeStr = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

export const api = {
  facilities: {
    list: async (): Promise<Facility[]> => {
      await delay(DELAY_MS);
      return FACILITIES_DATA;
    },
    getBySlug: async (slug: string): Promise<Facility | undefined> => {
      await delay(DELAY_MS);
      return FACILITIES_DATA.find(f => f.slug === slug);
    },
    getAvailability: async (id: string, date: string): Promise<AvailabilitySlot[]> => {
      // 1. Fetch Real Bookings from Supabase for this date
      const { data: existingBookings } = await supabase
        .from('bookings')
        .select('start_time, end_time, status')
        .eq('facility_id', id)
        .eq('date', date)
        .neq('status', 'cancelled'); // Ignore cancelled bookings

      // 2. Define operating hours (8 AM to 8 PM)
      const startOfDay = 8 * 60; // 480 min
      const endOfDay = 20 * 60; // 1200 min
      
      const slots: AvailabilitySlot[] = [];

      // 3. Create 1-hour slots
      for (let time = startOfDay; time < endOfDay; time += 60) {
          const slotStart = time;
          const slotEnd = time + 60; // Standard grid slot size
          const timeStr = toTimeStr(slotStart);

          // Check if this slot overlaps with ANY existing booking
          let isBlocked = false;
          if (existingBookings) {
              for (const booking of existingBookings) {
                  const { startMin: bStart, endMin: bEnd } = getBookingWindow(booking.start_time, booking.end_time);
                  if (Number.isNaN(bStart) || Number.isNaN(bEnd)) continue;

                  // Overlap condition: (SlotStart < BookingEnd) AND (SlotEnd > BookingStart)
                  if (slotStart < bEnd && slotEnd > bStart) {
                      isBlocked = true;
                      break;
                  }
              }
          }

          slots.push({
              time: timeStr,
              available: !isBlocked
          });
      }
      return slots;
    }
  },
  events: {
    list: async (): Promise<Event[]> => {
      await delay(DELAY_MS);
      return EVENTS_DATA;
    }
  },
  memberships: {
    list: async (): Promise<MembershipPlan[]> => {
      await delay(DELAY_MS);
      return MEMBERSHIPS_DATA;
    }
  },
  bookings: {
    list: async (): Promise<Booking[]> => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        return []; 
      }

      return data.map((b: any) => ({
        id: b.id,
        facilityId: b.facility_id,
        facilityName: b.facility_name, 
        userId: b.user_id,
        userName: b.user_email || 'User',
        userPhone: b.user_phone,
        date: b.date,
        startTime: b.start_time,
        endTime: b.end_time,
        // Normalize status to lowercase to prevent case sensitivity issues
        status: (b.status ? b.status.toLowerCase() : 'pending') as 'pending' | 'confirmed' | 'cancelled',
        totalPrice: b.total_price || 0,
        equipmentNeeded: b.equipment_needed,
        medicalConcerns: b.medical_concerns
      }));
    },
    getById: async (id: string): Promise<Booking | null> => {
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) return null;

        return {
             id: data.id,
             facilityId: data.facility_id,
             facilityName: data.facility_name,
             userId: data.user_id,
             userName: data.user_email,
             userPhone: data.user_phone,
             date: data.date,
             startTime: data.start_time,
             endTime: data.end_time,
             status: (data.status ? data.status.toLowerCase() : 'pending'),
             totalPrice: data.total_price,
             equipmentNeeded: data.equipment_needed,
             medicalConcerns: data.medical_concerns
        };
    },
    updateStatus: async (id: string, status: 'confirmed' | 'cancelled'): Promise<Booking> => {
        // Force lowercase status update
        const statusLower = status.toLowerCase();

        // We select the updated row to verify the change actually happened
        const { error, data } = await supabase
            .from('bookings')
            .update({ status: statusLower })
            .eq('id', id)
            .select()
            .single();
        
        if (error) {
            console.error("Supabase Update Error:", error);
            throw error;
        }
        
        // Critical Validation: If data is null, the row wasn't found or wasn't updated due to RLS
        if (!data) {
            throw new Error("Update failed: The booking could not be found or you do not have permission to modify it.");
        }

        return {
             id: data.id,
             facilityId: data.facility_id,
             facilityName: data.facility_name,
             userId: data.user_id,
             userName: data.user_email,
             userPhone: data.user_phone,
             date: data.date,
             startTime: data.start_time,
             endTime: data.end_time,
             status: data.status.toLowerCase(),
             totalPrice: data.total_price,
             equipmentNeeded: data.equipment_needed,
             medicalConcerns: data.medical_concerns
        };
    },
    create: async (booking: Omit<Booking, 'id' | 'status' | 'totalPrice'>): Promise<Booking> => {
      // 1. Calculate requested time range using flexible parsing (supports AM/PM and duration labels)
      const { startMin, endMin } = getBookingWindow(booking.startTime, booking.endTime);
      if (Number.isNaN(startMin) || Number.isNaN(endMin)) {
          throw new Error("Invalid time selection. Please choose a valid start time and duration.");
      }
      const endTimeStr = toTimeStr(endMin);

      // 2. SERVER-SIDE OVERLAP CHECK
      // Fetch any bookings for this facility on this date that might overlap
      const { data: conflicts, error: conflictError } = await supabase
        .from('bookings')
        .select('id, start_time, end_time, user_id')
        .eq('facility_id', booking.facilityId)
        .eq('date', booking.date)
        .neq('status', 'cancelled');
      
      if (conflictError) throw conflictError;

      if (conflicts && conflicts.length > 0) {
        for (const conflict of conflicts) {
           const { startMin: cStart, endMin: cEnd } = getBookingWindow(conflict.start_time, conflict.end_time);
           if (Number.isNaN(cStart) || Number.isNaN(cEnd)) continue;

           // Check strict overlap
           if (startMin < cEnd && endMin > cStart) {
              if (conflict.user_id === booking.userId) {
                  throw new Error("You already have a booking overlapping this time.");
              } else {
                  throw new Error("This time slot has just been taken by another user.");
              }
           }
        }
      }

      // 3. Insert if no conflicts
      const newBooking = {
        facility_id: booking.facilityId,
        facility_name: booking.facilityName,
        user_id: booking.userId,
        user_email: booking.userName,
        user_phone: booking.userPhone || null, // Correctly Map userPhone
        date: booking.date,
        start_time: booking.startTime,
        end_time: endTimeStr, // Save calculated HH:MM
        status: 'pending',
        total_price: 0, 
        equipment_needed: booking.equipmentNeeded || '',
        medical_concerns: booking.medicalConcerns || '',
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert([newBooking])
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        facilityId: data.facility_id,
        facilityName: data.facility_name,
        userId: data.user_id,
        userName: data.user_email,
        userPhone: data.user_phone,
        date: data.date,
        startTime: data.start_time,
        endTime: data.end_time,
        status: data.status ? data.status.toLowerCase() : 'pending',
        totalPrice: data.total_price,
        equipmentNeeded: data.equipment_needed,
        medicalConcerns: data.medical_concerns
      };
    }
  },
  admin: {
    getStats: async () => {
      // Remove artificial delay
      // Fetch all bookings to calculate stats
      const { data, error } = await supabase.from('bookings').select('status, created_at, date, facility_name, user_email, total_price');
      
      if (error) {
        console.error("Error fetching admin stats:", error);
        return {
          totalMembers: 0,
          activeBookings: 0,
          monthlyRevenue: 0,
          pendingRequests: 0,
          recentActivity: [],
          bookingTrends: []
        };
      }
      
      let activeCount = 0;
      let pendingCount = 0;
      let revenue = 0;
      const recentActivity: any[] = [];
      const trends = [];
      
      // Calculate Counts
      if (data) {
          // Strictly count status. 
          // Note: using lowerCase comparison to be safe against case variations in DB
          activeCount = data.filter((b: any) => b.status?.toLowerCase() === 'confirmed').length;
          pendingCount = data.filter((b: any) => b.status?.toLowerCase() === 'pending').length;
          
          revenue = data
            .filter((b: any) => b.status?.toLowerCase() === 'confirmed')
            .reduce((acc: number, curr: any) => acc + (curr.total_price || 50), 0);
          
          // Get recent activity (last 5)
          const sorted = [...data].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          
          recentActivity.push(...sorted.slice(0, 5).map((b:any) => ({
              user: b.user_email || 'User',
              action: 'booked',
              target: b.facility_name,
              time: new Date(b.created_at).toLocaleString(),
              rawTime: b.created_at
          })));

          // Calculate Trends (Last 7 Days)
          const today = new Date();
          for (let i = 6; i >= 0; i--) {
              const d = new Date(today);
              d.setDate(today.getDate() - i);
              const dateStr = d.toISOString().split('T')[0];
              
              const count = data.filter((b: any) => b.date === dateStr).length;
              
              trends.push({
                  date: d.toLocaleDateString('en-US', { weekday: 'short' }),
                  count: count
              });
          }
      }

      return {
        totalMembers: 1250, 
        activeBookings: activeCount,
        monthlyRevenue: revenue, 
        pendingRequests: pendingCount,
        recentActivity,
        bookingTrends: trends
      };
    }
  }
};
