import React from 'react';
import { Badge } from 'react-bootstrap';

const SeatLegend = () => {
  return (
    <div className="mt-4 d-flex justify-content-center gap-3">
      <div>
        <Badge bg="danger" className="me-2">■</Badge>
        <span>Booked</span>
      </div>
      <div>
        <Badge bg="success" className="me-2">■</Badge>
        <span>Selected</span>
      </div>
      <div>
        <Badge bg="secondary" className="me-2">■</Badge>
        <span>Available</span>
      </div>
    </div>
  );
};

export default SeatLegend;