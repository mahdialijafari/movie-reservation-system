import Showtime from '../Models/showtimeMd.js';

export const isOverlappingShowtime = async (movieId, startTime, endTime, screenId) => {
  const overlapping = await Showtime.findOne({
    screen: screenId,
    $or: [
      {
        startTime: { $lt: endTime, $gte: startTime }
      },
      {
        endTime: { $gt: startTime, $lte: endTime }
      },
      {
        startTime: { $lte: startTime },
        endTime: { $gte: endTime }
      }
    ]
  });

  return !!overlapping;
};
