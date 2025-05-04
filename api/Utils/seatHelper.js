import Seat from '../Models/seatMd.js';
import Reservation from '../Models/reservationMd.js';

export const checkSeatAvailability = async (showtimeId, seatNumbers = []) => {
  const takenSeats = await Reservation.find({ showtime: showtimeId }).distinct('seats');
  const overlap = seatNumbers.filter(seat => takenSeats.includes(seat));
  return {
    available: overlap.length === 0,
    taken: overlap,
  };
};

export const lockSeats = async (showtimeId, seatNumbers = [], userId) => {
  const { available, taken } = await checkSeatAvailability(showtimeId, seatNumbers);
  if (!available) {
    throw new Error(`Some seats are already reserved: ${taken.join(', ')}`);
  }

  // Proceed with reservation creation after validation
  return true;
};
