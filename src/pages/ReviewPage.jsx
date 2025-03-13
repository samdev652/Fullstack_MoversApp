import React from "react";
import ReviewForm from "../components/ReviewForm";

const ReviewPage = ({ appointmentId }) => {
  return (
    <div>
      <h2>Leave a Review</h2>
      <ReviewForm appointmentId={appointmentId} />
    </div>
  );
};

export default ReviewPage;
